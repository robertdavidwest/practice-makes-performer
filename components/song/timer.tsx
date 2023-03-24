export default function Timer({ time }: { time: number }) {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time) - minutes * 60;
  const mills = Math.round(100 * (time - seconds));
  return (
    <div className="timer">
      <span className="digits">{("0" + minutes).slice(-2)}:</span>
      <span className="digits">{("0" + seconds).slice(-2)}.</span>
      <span className="digits mili-sec">{("0" + mills).slice(-2)}</span>
    </div>
  );
}
