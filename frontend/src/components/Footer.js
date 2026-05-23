function Footer() {
  return (
    <footer
      className="mt-5 py-4 text-center text-white"
      style={{
        background: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
      }}
    >
      <div className="container">
        <h6 className="fw-bold mb-1">WAYU</h6>
        <p className="mb-2 small">
          Explore Smarter, Travel Better
        </p>

        <p className="small mb-1">
          Built using React, Flask & Machine Learning
        </p>

        <p className="small mb-0">
          © 2026 WAYU. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
