export const SaveChanges = ({ saveChanges }: { saveChanges: () => void }) => {
  return (
    <button
      onClick={saveChanges}
      className="py-1 px-4 bg-blue-200 text-blue-900 border-blue-900 border-2 hover:bg-blue-100 rounded-md"
    >
      Save Changes
    </button>
  );
};
