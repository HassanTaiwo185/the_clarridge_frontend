import PublicNavbar from "../components/PublicNavbar";

function Donate() {
  return (
    <div>
      <PublicNavbar />

      <section className="py-5" style={{ backgroundColor: "var(--clarridge-navy)" }}>
        <div className="container">
          <div className="row align-items-center g-5">
            <div className="col-12 col-lg-6">
              <div className="d-flex align-items-center gap-2 mb-2">
                <span style={{ width: "30px", height: "1px", backgroundColor: "var(--clarridge-gold)" }} />
                <span className="text-uppercase fw-semibold" style={{ color: "var(--clarridge-gold)", fontSize: "0.8rem", letterSpacing: "1px" }}>
                  Support Our Work
                </span>
              </div>
              <h1 className="text-white fw-normal mb-3" style={{ fontSize: "2rem" }}>
                Help us open more doors.
              </h1>
              <p className="text-white-50 mb-0">
                Every contribution helps The Clarridge expand access to opportunity for
                Nigeria's brightest students. Thank you for considering a donation —
                your support means the world to us.
              </p>
            </div>

            <div className="col-12 col-lg-6">
              <div className="bg-white rounded p-4">
                <h6 className="text-navy fw-bold mb-3">Bank Transfer Details</h6>

                <div className="mb-3 pb-3" style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <div className="small text-muted mb-1">Account Number</div>
                  <div className="fw-bold text-navy" style={{ fontSize: "1.1rem", letterSpacing: "0.5px" }}>
                    1795576318
                  </div>
                </div>

                <div className="mb-3 pb-3" style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <div className="small text-muted mb-1">Account Name</div>
                  <div className="fw-semibold text-navy">HUSSEIN KEHINDE AYINDE</div>
                </div>

                <div className="mb-3 pb-3" style={{ borderBottom: "1px solid #e5e7eb" }}>
                  <div className="small text-muted mb-1">Account Type</div>
                  <div className="fw-semibold text-navy">Premier Savings</div>
                </div>

                <div className="mb-0">
                  <div className="small text-muted mb-1">Bank</div>
                  <div className="fw-semibold text-navy">Access Bank Nigeria</div>
                </div>
              </div>

              <p className="small text-white-50 mt-3 mb-0">
                After donating, feel free to include "Donation" in the subject when
                reaching out via our contact form — we'd love to personally thank
                you for your generosity.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Donate;