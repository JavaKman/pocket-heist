import { renderHook } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useUser } from "@/lib/auth/useUser";
import { AuthContext } from "@/lib/auth/AuthContext";
import { AuthContextValue } from "@/lib/auth/types";

describe("useUser", () => {
  it("returns user and loading state from context", () => {
    const mockContextValue: AuthContextValue = {
      user: { id: "123", email: "test@example.com", displayName: "Test User" },
      loading: false,
    };

    const { result } = renderHook(() => useUser(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={mockContextValue}>
          {children}
        </AuthContext.Provider>
      ),
    });

    expect(result.current.user).toEqual(mockContextValue.user);
    expect(result.current.loading).toBe(false);
  });

  it("returns null user when not authenticated", () => {
    const mockContextValue: AuthContextValue = {
      user: null,
      loading: false,
    };

    const { result } = renderHook(() => useUser(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={mockContextValue}>
          {children}
        </AuthContext.Provider>
      ),
    });

    expect(result.current.user).toBeNull();
  });

  it("returns loading true during initialization", () => {
    const mockContextValue: AuthContextValue = {
      user: null,
      loading: true,
    };

    const { result } = renderHook(() => useUser(), {
      wrapper: ({ children }) => (
        <AuthContext.Provider value={mockContextValue}>
          {children}
        </AuthContext.Provider>
      ),
    });

    expect(result.current.loading).toBe(true);
  });

  it("throws error when used outside AuthProvider", () => {
    // Suppress console.error for this test
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() => {
      renderHook(() => useUser());
    }).toThrow("useUser must be used within an AuthProvider");

    consoleError.mockRestore();
  });
});
