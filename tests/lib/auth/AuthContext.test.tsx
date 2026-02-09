import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { AuthProvider } from "@/lib/auth/AuthContext";
import { useUser } from "@/lib/auth/useUser";
import { User } from "@/lib/auth/types";
import type { User as FirebaseUser } from "firebase/auth";

// Mock Firebase
const mockOnAuthStateChanged = vi.fn();
vi.mock("@/lib/firebase", () => ({
  auth: {},
}));

vi.mock("firebase/auth", () => ({
  onAuthStateChanged: (...args: unknown[]) => mockOnAuthStateChanged(...args),
}));

// Test component that uses useUser hook
function TestComponent() {
  const { user, loading } = useUser();

  if (loading) return <div>Loading...</div>;
  if (!user) return <div>Not authenticated</div>;
  return <div>Authenticated: {user.email}</div>;
}

describe("AuthProvider", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows loading state initially", () => {
    mockOnAuthStateChanged.mockImplementation(() => () => {});

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("updates to authenticated state when user logs in", async () => {
    const mockFirebaseUser: Partial<FirebaseUser> = {
      uid: "123",
      email: "test@example.com",
      displayName: "Test User",
    };

    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      // Simulate auth state change
      callback(mockFirebaseUser);
      return () => {}; // unsubscribe function
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Authenticated: test@example.com")).toBeInTheDocument();
    });
  });

  it("updates to unauthenticated state when user logs out", async () => {
    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      // Simulate logged out state
      callback(null);
      return () => {};
    });

    render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(screen.getByText("Not authenticated")).toBeInTheDocument();
    });
  });

  it("cleans up listener on unmount", () => {
    const mockUnsubscribe = vi.fn();
    mockOnAuthStateChanged.mockReturnValue(mockUnsubscribe);

    const { unmount } = render(
      <AuthProvider>
        <TestComponent />
      </AuthProvider>
    );

    unmount();

    expect(mockUnsubscribe).toHaveBeenCalled();
  });

  it("provides user with correct properties", async () => {
    const mockFirebaseUser: Partial<FirebaseUser> = {
      uid: "user123",
      email: "user@test.com",
      displayName: "User Name",
    };

    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockFirebaseUser);
      return () => {};
    });

    let capturedUser: User | null = null;

    function CaptureUserComponent() {
      const { user } = useUser();
      // Use a side effect to capture the value in a way that's acceptable for tests
      if (user !== capturedUser) {
        capturedUser = user;
      }
      return null;
    }

    render(
      <AuthProvider>
        <CaptureUserComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(capturedUser).toEqual({
        id: "user123",
        email: "user@test.com",
        displayName: "User Name",
      });
    });
  });

  it("handles null email by defaulting to empty string", async () => {
    const mockFirebaseUser: Partial<FirebaseUser> = {
      uid: "user456",
      email: null,
      displayName: null,
    };

    mockOnAuthStateChanged.mockImplementation((auth, callback) => {
      callback(mockFirebaseUser);
      return () => {};
    });

    let capturedUser: User | null = null;

    function CaptureUserComponent() {
      const { user } = useUser();
      // Use a side effect to capture the value in a way that's acceptable for tests
      if (user !== capturedUser) {
        capturedUser = user;
      }
      return null;
    }

    render(
      <AuthProvider>
        <CaptureUserComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(capturedUser).toEqual({
        id: "user456",
        email: "",
        displayName: null,
      });
    });
  });
});
