// preview page for newly created UI components
import Skeleton from "@/components/Skeleton";
import Avatar from "@/components/Avatar";

export default function PreviewPage() {
  return (
    <div className="page-content">
      <h2>Preview</h2>

      <div className="grid grid-cols-3 gap-8 mt-8">
        <div className="bg-light p-8 rounded-lg">
          <div className="flex gap-6 mb-8">
            <Skeleton variant="circular" width="120px" height="120px" />
            <div className="flex-1 space-y-4 pt-4">
              <Skeleton height="20px" />
              <Skeleton height="20px" width="70%" />
            </div>
          </div>

          <div className="space-y-6">
            <Skeleton height="20px" />
            <Skeleton height="20px" />
            <Skeleton height="20px" width="60%" />
          </div>
        </div>

        <div className="bg-light p-8 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Avatar</h3>
          <div className="flex gap-4 items-center">
            <Avatar name="alice" />
            <Avatar name="JohnSmith" />
            <Avatar name="Jane Doe" />
            <Avatar name="PocketHeist" />
          </div>
        </div>
      </div>
    </div>
  );
}
