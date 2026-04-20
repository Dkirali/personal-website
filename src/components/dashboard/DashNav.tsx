export function DashNav() {
  return (
    <nav className="top-nav">
      <div className="brand">
        DORUK<span>.EXE</span>
      </div>
      <ul>
        <li>Store</li>
        <li>Library</li>
        <li>Community</li>
        <li className="active">Doruk</li>
      </ul>
      <div className="spacer" />
      <div className="user">
        <span className="status-dot" />
        doruk-kirali · Online
      </div>
    </nav>
  );
}
