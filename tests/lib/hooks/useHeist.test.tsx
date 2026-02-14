import { renderHook, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { useHeist } from "@/lib/hooks/useHeist";
import { Heist } from "@/types/firestore";

// Mock firebase/firestore
vi.mock("firebase/firestore", () => ({
  doc: vi.fn(),
  onSnapshot: vi.fn(),
}));

// Mock firebase config
vi.mock("@/lib/firebase", () => ({
  db: {},
}));

// Mock COLLECTIONS
vi.mock("@/types/firestore", async () => {
  const actual = await vi.importActual("@/types/firestore");
  return {
    ...actual,
    COLLECTIONS: {
      HEISTS: "heists",
    },
  };
});

const { doc, onSnapshot } = await import("firebase/firestore");

const mockHeist: Heist = {
  id: "test-heist-1",
  title: "Test Heist",
  description: "Test description",
  createdBy: "user123",
  createdByCodename: "TestUser",
  assignedTo: "user456",
  assignedToCodename: "TestAssignee",
  deadline: new Date(),
  createdAt: new Date(),
  finalStatus: null,
};

describe("useHeist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns loading state initially", () => {
    vi.mocked(doc).mockReturnValue({
      withConverter: vi.fn().mockReturnThis(),
    } as any);

    vi.mocked(onSnapshot).mockReturnValue(() => {});

    const { result } = renderHook(() => useHeist("test-heist-1"));

    expect(result.current.loading).toBe(true);
    expect(result.current.heist).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it("returns heist data when snapshot exists", async () => {
    vi.mocked(doc).mockReturnValue({
      withConverter: vi.fn().mockReturnThis(),
    } as any);

    vi.mocked(onSnapshot).mockImplementation((ref, onNext) => {
      const snapshot = {
        exists: () => true,
        data: () => mockHeist,
      };
      onNext(snapshot as any);
      return () => {};
    });

    const { result } = renderHook(() => useHeist("test-heist-1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.heist).toEqual(mockHeist);
    expect(result.current.error).toBe(null);
  });

  it("returns null heist when snapshot doesn't exist", async () => {
    vi.mocked(doc).mockReturnValue({
      withConverter: vi.fn().mockReturnThis(),
    } as any);

    vi.mocked(onSnapshot).mockImplementation((ref, onNext) => {
      const snapshot = {
        exists: () => false,
      };
      onNext(snapshot as any);
      return () => {};
    });

    const { result } = renderHook(() => useHeist("test-heist-1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.heist).toBe(null);
    expect(result.current.error).toBe(null);
  });

  it("handles errors from Firestore", async () => {
    vi.mocked(doc).mockReturnValue({
      withConverter: vi.fn().mockReturnThis(),
    } as any);

    const mockError = new Error("Firestore error");

    vi.mocked(onSnapshot).mockImplementation((ref, onNext, onError) => {
      onError?.(mockError);
      return () => {};
    });

    const { result } = renderHook(() => useHeist("test-heist-1"));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.heist).toBe(null);
    expect(result.current.error).toEqual(mockError);
  });

  it("does not fetch when heistId is null", () => {
    const { result } = renderHook(() => useHeist(null));

    expect(result.current.loading).toBe(false);
    expect(result.current.heist).toBe(null);
    expect(result.current.error).toBe(null);
    expect(onSnapshot).not.toHaveBeenCalled();
  });

  it("does not fetch when heistId is undefined", () => {
    const { result } = renderHook(() => useHeist(undefined));

    expect(result.current.loading).toBe(false);
    expect(result.current.heist).toBe(null);
    expect(result.current.error).toBe(null);
    expect(onSnapshot).not.toHaveBeenCalled();
  });

  it("unsubscribes when component unmounts", () => {
    const unsubscribe = vi.fn();

    vi.mocked(doc).mockReturnValue({
      withConverter: vi.fn().mockReturnThis(),
    } as any);

    vi.mocked(onSnapshot).mockReturnValue(unsubscribe);

    const { unmount } = renderHook(() => useHeist("test-heist-1"));

    unmount();

    expect(unsubscribe).toHaveBeenCalled();
  });

  it("resets state when heistId changes", async () => {
    vi.mocked(doc).mockReturnValue({
      withConverter: vi.fn().mockReturnThis(),
    } as any);

    let snapshotCallback: any;
    vi.mocked(onSnapshot).mockImplementation((ref, onNext) => {
      snapshotCallback = onNext;
      return () => {};
    });

    const { result, rerender } = renderHook(
      ({ id }) => useHeist(id),
      { initialProps: { id: "heist-1" } }
    );

    // First snapshot
    snapshotCallback({
      exists: () => true,
      data: () => mockHeist,
    });

    await waitFor(() => {
      expect(result.current.heist).toEqual(mockHeist);
    });

    // Change heistId
    rerender({ id: "heist-2" });

    // State should reset
    expect(result.current.loading).toBe(true);
  });
});
