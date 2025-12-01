export default function DemoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-5xl flex flex-col items-center mx-auto p-6">
      {children}
    </div>
  );
}
