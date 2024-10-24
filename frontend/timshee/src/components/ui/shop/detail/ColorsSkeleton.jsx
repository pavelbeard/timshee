export default function ColorsSkeleton() {
  const fakeColors = Array(10)
    .fill(0)
    .map((_, i) => (
      <li
        key={i}
        className="size-8 rounded-2xl border-black border-[1px] bg-gray-100"
      ></li>
    ));
  return (
    <ul className="py-4 grid grid-cols-7 lg:grid-cols-8 items-center justify-items-center justify-center gap-2">
      {fakeColors}
    </ul>
  );
}
