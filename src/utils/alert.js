export function makeAlert(type, message) {
  return <div className={'alert alert--' + type}>{message}</div>;
}
