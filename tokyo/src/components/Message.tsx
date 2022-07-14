export default function Message({ message }: { message: string }) {
  return (
    <div className="px-4">
      <div className="mx-auto max-w-screen-sm">
        <h2 className="mb-4 text-4xl font-bold">{message}</h2>
      </div>
    </div>
  );
}
