export default function Color(props) {
  return (
    <div
      key={props?.index ? props.index * 2 : 0}
      style={{
        backgroundColor: props.hex,
      }}
      className="size-4"
    ></div>
  );
}
