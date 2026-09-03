/**
 * Prototype state for the Contributor Workspace.
 *
 * Everything lives in React state and is mirrored to localStorage so a
 * contributor can close the tab mid-submission and come back. No network,
 * no backend — this is a working prototype of the contribution workflow.
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import {
  STATUSES,
  type MediaItem,
  type SourceItem,
  type Submission,
  type SubmissionStatus,
  type SubmissionType,
  TYPE_CONFIG,
} from "./schema";
import { seedOrganisation, seedMembers, seedNotifications, seedSubmissions } from "./seed";

export type ContributorRole = "Organisation Admin" | "Contributor";

export interface ContributorUser {
  name: string;
  email: string;
  role: string;
  workspaceRole: ContributorRole;
  country: string;
  bio?: string;
  language?: string;
  emailVerified: boolean;
  onboarded: boolean;
  notify?: Record<string, boolean>;
}

export interface Organisation {
  name: string;
  type: string;
  country: string;
  city: string;
  website: string;
  description: string;
  interests: string[];
  themes: string[];
  collaborationInterests: string;
  contact: string;
}

export interface Member {
  id: string;
  name: string;
  email: string;
  role: ContributorRole;
  status: "Active" | "Invited";
  joined: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  date: string;
  read: boolean;
  submissionId?: string;
}

export const ORGANISATION_TYPES = [
  "Embassy / Mission",
  "Museum",
  "University",
  "Research Centre",
  "Archive",
  "Cultural Community",
  "Cultural Centre",
  "Festival / Event Organisation",
  "Government Institution",
  "Local Government",
  "International Organisation",
  "Artist Collective",
  "Other",
] as const;

interface WorkspaceState {
  user: ContributorUser | null;
  organisation: Organisation;
  members: Member[];
  submissions: Submission[];
  notifications: Notification[];
}

const STORAGE_KEY = "iv-contributor-workspace-v1";

const defaultState = (): WorkspaceState => ({
  user: null,
  organisation: seedOrganisation,
  members: seedMembers,
  submissions: seedSubmissions(),
  notifications: seedNotifications(),
});

interface Ctx extends WorkspaceState {
  hydrated: boolean;
  signIn: (email: string, name?: string) => void;
  register: (input: Partial<ContributorUser>) => void;
  verifyEmail: () => void;
  signOut: () => void;
  completeOnboarding: (user: Partial<ContributorUser>, org: Partial<Organisation>) => void;
  updateUser: (patch: Partial<ContributorUser>) => void;
  updateOrganisation: (patch: Partial<Organisation>) => void;
  inviteMember: (email: string, role: ContributorRole, message?: string) => void;
  updateMemberRole: (id: string, role: ContributorRole) => void;
  removeMember: (id: string) => void;
  createSubmission: (type: SubmissionType) => Submission;
  getSubmission: (id: string) => Submission | undefined;
  patchSubmission: (id: string, patch: Partial<Submission>) => void;
  patchData: (id: string, patch: Record<string, unknown>) => void;
  setMedia: (id: string, media: MediaItem[]) => void;
  setSources: (id: string, sources: SourceItem[]) => void;
  submitForReview: (id: string, resubmission?: boolean) => void;
  resolveFeedback: (id: string, feedbackId: string, resolved: boolean) => void;
  suggestUpdate: (id: string, kind: string, detail: string) => void;
  deleteSubmission: (id: string) => void;
  markNotificationsRead: () => void;
  savedAt: number | null;
}

const WorkspaceContext = createContext<Ctx | null>(null);

const now = () => new Date().toISOString();
const uid = () => Math.random().toString(36).slice(2, 10);

export function WorkspaceProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<WorkspaceState>(defaultState);
  const [hydrated, setHydrated] = useState(false);
  const [savedAt, setSavedAt] = useState<number | null>(null);
  const first = useRef(true);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as WorkspaceState;
        setState({ ...defaultState(), ...parsed });
      }
    } catch {
      /* start fresh */
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (first.current) {
      first.current = false;
      return;
    }
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      setSavedAt(Date.now());
    } catch {
      /* quota — the prototype keeps working in memory */
    }
  }, [state, hydrated]);

  const notify = useCallback((n: Omit<Notification, "id" | "date" | "read">) => {
    setState((s) => ({
      ...s,
      notifications: [{ id: uid(), date: now(), read: false, ...n }, ...s.notifications],
    }));
  }, []);

  const value = useMemo<Ctx>(() => {
    const mutate = (fn: (s: WorkspaceState) => WorkspaceState) => setState(fn);
    const touch = (sub: Submission): Submission => ({ ...sub, updatedAt: now() });

    return {
      ...state,
      hydrated,
      savedAt,
      signIn: (email, name) =>
        mutate((s) => ({
          ...s,
          user: s.user
            ? { ...s.user, email }
            : {
                name: name || "Maya Kusuma",
                email,
                role: "Cultural Programme Officer",
                workspaceRole: "Organisation Admin",
                country: "Indonesia",
                language: "English",
                emailVerified: true,
                onboarded: true,
              },
        })),
      register: (input) =>
        mutate((s) => ({
          ...s,
          user: {
            name: "",
            email: "",
            role: "",
            workspaceRole: "Organisation Admin",
            country: "",
            language: "English",
            emailVerified: false,
            onboarded: false,
            ...input,
          } as ContributorUser,
        })),
      verifyEmail: () =>
        mutate((s) => (s.user ? { ...s, user: { ...s.user, emailVerified: true } } : s)),
      signOut: () => mutate((s) => ({ ...s, user: null })),
      completeOnboarding: (user, org) =>
        mutate((s) => ({
          ...s,
          user: { ...(s.user as ContributorUser), ...user, emailVerified: true, onboarded: true },
          organisation: { ...s.organisation, ...org },
        })),
      updateUser: (patch) => mutate((s) => (s.user ? { ...s, user: { ...s.user, ...patch } } : s)),
      updateOrganisation: (patch) =>
        mutate((s) => ({ ...s, organisation: { ...s.organisation, ...patch } })),
      inviteMember: (email, role) =>
        mutate((s) => ({
          ...s,
          members: [
            ...s.members,
            {
              id: uid(),
              name: email.split("@")[0]?.replace(/[._]/g, " ") ?? email,
              email,
              role,
              status: "Invited",
              joined: now(),
            },
          ],
        })),
      updateMemberRole: (id, role) =>
        mutate((s) => ({
          ...s,
          members: s.members.map((m) => (m.id === id ? { ...m, role } : m)),
        })),
      removeMember: (id) => mutate((s) => ({ ...s, members: s.members.filter((m) => m.id !== id) })),
      createSubmission: (type) => {
        const sub: Submission = {
          id: uid(),
          type,
          title: `Untitled ${TYPE_CONFIG[type].label.toLowerCase()}`,
          status: "draft",
          createdAt: now(),
          updatedAt: now(),
          submittedBy: state.user?.name ?? "You",
          data: {},
          media: [],
          sources: [],
          feedback: [],
          activity: [{ id: uid(), date: now(), label: "Draft created", by: state.user?.name ?? "You" }],
        };
        mutate((s) => ({ ...s, submissions: [sub, ...s.submissions] }));
        return sub;
      },
      getSubmission: (id) => state.submissions.find((s) => s.id === id),
      patchSubmission: (id, patch) =>
        mutate((s) => ({
          ...s,
          submissions: s.submissions.map((sub) => (sub.id === id ? touch({ ...sub, ...patch }) : sub)),
        })),
      patchData: (id, patch) =>
        mutate((s) => ({
          ...s,
          submissions: s.submissions.map((sub) =>
            sub.id === id
              ? touch({
                  ...sub,
                  data: { ...sub.data, ...patch },
                  title: (patch["title"] as string) || sub.title,
                })
              : sub,
          ),
        })),
      setMedia: (id, media) =>
        mutate((s) => ({
          ...s,
          submissions: s.submissions.map((sub) => (sub.id === id ? touch({ ...sub, media }) : sub)),
        })),
      setSources: (id, sources) =>
        mutate((s) => ({
          ...s,
          submissions: s.submissions.map((sub) => (sub.id === id ? touch({ ...sub, sources }) : sub)),
        })),
      submitForReview: (id, resubmission) => {
        const label = resubmission ? "Revision submitted" : "Submitted for editorial review";
        const status: SubmissionStatus = resubmission ? "editorial_review" : "submitted";
        mutate((s) => ({
          ...s,
          submissions: s.submissions.map((sub) =>
            sub.id === id
              ? touch({
                  ...sub,
                  status,
                  submittedAt: sub.submittedAt ?? now(),
                  feedback: resubmission ? sub.feedback.map((f) => ({ ...f, resolved: true })) : sub.feedback,
                  activity: [
                    ...sub.activity,
                    { id: uid(), date: now(), label, by: state.user?.name ?? "You" },
                  ],
                })
              : sub,
          ),
        }));
        const sub = state.submissions.find((x) => x.id === id);
        notify({
          title: resubmission ? "Revisions received" : "Submission received",
          body: resubmission
            ? `Your revisions to “${sub?.title ?? "your submission"}” have been sent back to the editorial team.`
            : `We have received “${sub?.title ?? "your submission"}”. ${STATUSES.submitted.meaning}`,
          submissionId: id,
        });
      },
      resolveFeedback: (id, feedbackId, resolved) =>
        mutate((s) => ({
          ...s,
          submissions: s.submissions.map((sub) =>
            sub.id === id
              ? {
                  ...sub,
                  feedback: sub.feedback.map((f) => (f.id === feedbackId ? { ...f, resolved } : f)),
                }
              : sub,
          ),
        })),
      suggestUpdate: (id, kind, detail) => {
        mutate((s) => ({
          ...s,
          submissions: s.submissions.map((sub) =>
            sub.id === id
              ? touch({
                  ...sub,
                  updates: [
                    ...(sub.updates ?? []),
                    { id: uid(), createdAt: now(), kind, detail, status: "Submitted" },
                  ],
                  activity: [
                    ...sub.activity,
                    { id: uid(), date: now(), label: `Update suggested: ${kind}`, by: state.user?.name ?? "You" },
                  ],
                })
              : sub,
          ),
        }));
        notify({
          title: "Update request received",
          body: "Your suggested update will be reviewed before the published page changes.",
          submissionId: id,
        });
      },
      deleteSubmission: (id) =>
        mutate((s) => ({ ...s, submissions: s.submissions.filter((sub) => sub.id !== id) })),
      markNotificationsRead: () =>
        mutate((s) => ({ ...s, notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
    };
  }, [state, hydrated, savedAt, notify]);

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspace() {
  const ctx = useContext(WorkspaceContext);
  if (!ctx) throw new Error("useWorkspace must be used inside WorkspaceProvider");
  return ctx;
}
