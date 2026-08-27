import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PublicNavbar from "../components/PublicNavbar";
import ColdStartLoader from "../components/ColdStartLoader";
import { getPublicProgrammes } from "../api/public";
import { submitTestimonial } from "../api/testimonialsPublic";
import api from "../api/axios";

function statusPillStyle(status) {
  if (status === "open") return { backgroundColor: "#e8f4ea", color: "#198754", borderColor: "#c3e6cb" };
  if (status === "upcoming") return { backgroundColor: "#fdf3e3", color: "#97742f", borderColor: "#f0dfb0" };
  return { backgroundColor: "#eef1f5", color: "#6c757d", borderColor: "#dde2e8" };
}

function statusLabel(status) {
  if (status === "open") return "Open Now";
  if (status === "upcoming") return "Upcoming";
  return "Completed";
}

function initials(name) {
  return name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
}

const OBSERVATORY_TABS = [
  { value: "featured", label: "Featured" },
  { value: "research", label: "Research" },
  { value: "essays", label: "Essays" },
  { value: "student_voices", label: "Student Voices" },
  { value: "interviews", label: "Interviews" },
  { value: "publications", label: "Publications" },
];

function categoryDisplayLabel(category) {
  const match = OBSERVATORY_TABS.find((t) => t.value === category);
  return match ? match.label : category;
}

function Home() {
  const navigate = useNavigate();

  const [programmes, setProgrammes] = useState([]);
  const [loadingProgrammes, setLoadingProgrammes] = useState(true);
  const [programmesError, setProgrammesError] = useState("");
  const [statusFilter, setStatusFilter] = useState("open");
  const [selectedProgramme, setSelectedProgramme] = useState(null);
  const [showAllProgrammes, setShowAllProgrammes] = useState(false);

  const [allMembers, setAllMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showAllMembers, setShowAllMembers] = useState(false);

  const [impactStats, setImpactStats] = useState({
    programmeCount: null,
    studentsReached: null,
    universityCount: null,
  });

  const [observatoryPosts, setObservatoryPosts] = useState([]);
  const [loadingObservatory, setLoadingObservatory] = useState(true);
  const [observatoryTab, setObservatoryTab] = useState("featured");

  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingTeamMembers, setLoadingTeamMembers] = useState(true);
  const [selectedTeamMember, setSelectedTeamMember] = useState(null);
  const [showAllTeamMembers, setShowAllTeamMembers] = useState(false);

  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [showAllTestimonials, setShowAllTestimonials] = useState(false);

  const [showShareStoryModal, setShowShareStoryModal] = useState(false);
  const [storyForm, setStoryForm] = useState({ submitted_by: "", programme: "", content: "" });
  const [submittingStory, setSubmittingStory] = useState(false);
  const [storyError, setStoryError] = useState("");
  const [storySuccess, setStorySuccess] = useState("");

  const [contactForm, setContactForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [submittingContact, setSubmittingContact] = useState(false);
  const [contactSuccess, setContactSuccess] = useState("");
  const [contactError, setContactError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getPublicProgrammes();
        setProgrammes(res.data);
        setImpactStats((prev) => ({ ...prev, programmeCount: res.data.length }));
      } catch {
        setProgrammesError("Unable to load programmes right now.");
      } finally {
        setLoadingProgrammes(false);
      }
    };
    load();
  }, []);

  useEffect(() => {
    const loadMembers = async () => {
      try {
        const res = await api.get("/collegium/");
        setAllMembers(res.data);
      } catch {
        // silently fail
      } finally {
        setLoadingMembers(false);
      }
    };
    loadMembers();
  }, []);

  useEffect(() => {
    const loadImpactStats = async () => {
      try {
        const res = await api.get("/impact/");
        setImpactStats((prev) => ({
          ...prev,
          studentsReached: res.data.students_reached,
          universityCount: res.data.universities,
        }));
      } catch {
        // silently fail
      }
    };
    loadImpactStats();
  }, []);

  useEffect(() => {
    const loadObservatory = async () => {
      try {
        const res = await api.get("/observatory/");
        setObservatoryPosts(res.data);
      } catch {
        // silently fail
      } finally {
        setLoadingObservatory(false);
      }
    };
    loadObservatory();
  }, []);

useEffect(() => {
  const loadTeamMembers = async () => {
    try {
      const res =  await api.get("/team/");


      console.log("TEAM DATA:", res.data);
      console.log("FIRST PHOTO:", res.data[0]?.photo);

      setTeamMembers(res.data);
    } catch (error) {
      console.error("Failed to load team members:", error);
    } finally {
      setLoadingTeamMembers(false);
    }
  };

  loadTeamMembers();
}, []);

  const loadTestimonials = async () => {
    try {
      const res = await api.get("/testimonials/public/");
      setTestimonials(res.data);
    } catch {
      // silently fail
    } finally {
      setLoadingTestimonials(false);
    }
  };

  useEffect(() => {
    loadTestimonials();
  }, []);

  const handleStatusFilterChange = (s) => {
    setStatusFilter(s);
    setShowAllProgrammes(false);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    setSubmittingContact(true);
    setContactError("");
    setContactSuccess("");
    try {
      const res = await api.post("/contact/", contactForm);
      setContactSuccess(res.data.message || "Message sent successfully.");
      setContactForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setContactError("Unable to send your message. Please try again.");
    } finally {
      setSubmittingContact(false);
    }
  };

  const openShareStoryModal = () => {
    setStoryForm({ submitted_by: "", programme: "", content: "" });
    setStoryError("");
    setStorySuccess("");
    setShowShareStoryModal(true);
  };

  const closeShareStoryModal = () => {
    if (submittingStory) return;
    setShowShareStoryModal(false);
  };

  const handleStorySubmit = async (e) => {
    e.preventDefault();
    setStoryError("");
    setStorySuccess("");
    if (!storyForm.submitted_by.trim() || !storyForm.programme.trim() || !storyForm.content.trim()) {
      setStoryError("Please fill in all fields.");
      return;
    }
    setSubmittingStory(true);
    try {
      await submitTestimonial(storyForm);
      setStorySuccess("Thank you! Your story has been submitted for review.");
      setStoryForm({ submitted_by: "", programme: "", content: "" });
    } catch (err) {
      const backendData = err.response?.data;
      if (backendData) {
        const firstError = Object.values(backendData)[0];
        setStoryError(Array.isArray(firstError) ? firstError[0] : String(firstError));
      } else {
        setStoryError("Unable to submit your story. Please try again.");
      }
    } finally {
      setSubmittingStory(false);
    }
  };

  const filteredProgrammes = programmes.filter((p) => p.status === statusFilter);
  const displayedProgrammes = showAllProgrammes ? filteredProgrammes : filteredProgrammes.slice(0, 5);
  const featuredPost = observatoryPosts.find((p) => p.is_featured);
  const observatoryFiltered =
    observatoryTab === "featured"
      ? observatoryPosts.filter((p) => !p.is_featured).slice(0, 3)
      : observatoryPosts.filter((p) => p.category === observatoryTab).slice(0, 3);

  return (
    <div style={{ position: "relative", backgroundColor: "#fff" }}>
      <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", zIndex: 0, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#fff" }}>
        <img src="/logo.png" alt="" style={{ width: "700px", maxWidth: "80vw", opacity: 0.08, pointerEvents: "none" }} />
      </div>

      <div style={{ position: "relative", zIndex: 1 }}>
        <PublicNavbar />

        <section id="about" className="text-white py-5" style={{ backgroundColor: "rgba(10, 31, 68, 0.97)" }}>
          <div className="container py-5" style={{ maxWidth: "800px" }}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <span style={{ width: "40px", height: "1px", backgroundColor: "var(--clarridge-gold)" }} />
              <span className="text-uppercase fw-semibold" style={{ color: "var(--clarridge-gold)", fontSize: "0.8rem", letterSpacing: "2px" }}>A Tradition of Excellence</span>
            </div>
            <h1 className="fw-normal mb-4" style={{ fontSize: "2.75rem", lineHeight: 1.2 }}>We believe talent is universal. Opportunity should be too.</h1>
            <p className="text-white-50 mb-4" style={{ fontSize: "1.05rem", maxWidth: "600px" }}>
              The Clarridge prepares Nigeria's students to become globally competitive candidates, then bridges them to the opportunities that follow.
            </p>
            <div className="d-flex flex-wrap gap-3">
              <button type="button" className="btn fw-bold px-4 py-2" style={{ backgroundColor: "var(--clarridge-gold)", borderColor: "var(--clarridge-gold)", color: "#fff" }} onClick={() => document.getElementById("programmes")?.scrollIntoView({ behavior: "smooth" })}>Explore Our Work</button>
              <button type="button" className="btn btn-outline-light px-4 py-2" onClick={() => navigate("/opportunities")}>View Opportunities</button>
            </div>
          </div>
        </section>

        <section id="programmes" className="py-5" style={{ backgroundColor: "rgba(248, 249, 251, 0.97)" }}>
          <div className="container">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span style={{ width: "30px", height: "1px", backgroundColor: "var(--clarridge-gold)" }} />
              <span className="text-uppercase fw-semibold" style={{ color: "var(--clarridge-gold)", fontSize: "0.8rem", letterSpacing: "1px" }}>Programmes</span>
            </div>
            <h2 className="text-navy fw-normal mb-2" style={{ fontSize: "2rem" }}>Creating pathways to excellence.</h2>
            {statusFilter === "open" && (
              <p className="text-uppercase fw-semibold mb-2" style={{ color: "var(--clarridge-gold)", fontSize: "0.85rem", letterSpacing: "0.5px" }}>Current Opportunities</p>
            )}
            <p className="text-muted mb-4" style={{ maxWidth: "600px" }}>Every programme with a current or upcoming application window.</p>
            <div className="d-flex flex-wrap gap-2 mb-4">
              {["open", "upcoming", "completed"].map((s) => (
                <button key={s} type="button" className="btn btn-sm rounded-pill fw-semibold px-3" style={statusFilter === s ? { backgroundColor: "var(--clarridge-navy)", color: "#fff", border: "1px solid var(--clarridge-navy)" } : { backgroundColor: "#fff", color: "var(--clarridge-navy)", border: "1px solid #ddd" }} onClick={() => handleStatusFilterChange(s)}>{statusLabel(s).toUpperCase()}</button>
              ))}
            </div>
            {loadingProgrammes ? (
              <ColdStartLoader />
            ) : programmesError ? (
              <div className="alert alert-danger">{programmesError}</div>
            ) : filteredProgrammes.length === 0 ? (
              <p className="text-muted">No {statusLabel(statusFilter).toLowerCase()} programmes right now.</p>
            ) : (
              <>
                <div className="row g-3">
                  {displayedProgrammes.map((p) => (
                    <div className="col-12 col-md-6 col-lg-4" key={p.id}>
                      <div className="bg-white rounded p-4 h-100" role="button" onClick={() => setSelectedProgramme(p)} style={{ border: "1px solid #e5e7eb", cursor: "pointer", transition: "box-shadow 0.15s ease" }} onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(10,31,68,0.1)")} onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}>
                        <div className="d-flex align-items-center gap-3 mb-3">
                          {p.cover_image ? (
                            <img src={p.cover_image} alt={p.name} style={{ width: "48px", height: "48px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                          ) : (
                            <div className="d-flex align-items-center justify-content-center bg-light text-muted rounded-circle" style={{ width: "48px", height: "48px", fontSize: "0.65rem", flexShrink: 0 }}>N/A</div>
                          )}
                          <span className="badge rounded-pill fw-semibold px-3 py-2 text-uppercase" style={{ ...statusPillStyle(p.status), fontSize: "0.7rem", border: "1px solid" }}>● {statusLabel(p.status)}</span>
                        </div>
                        <h5 className="text-navy fw-bold mb-2">{p.name}</h5>
                        {p.description && <p className="text-muted small mb-3">{p.description}</p>}
                        {p.status === "open" && p.end_date && (
                          <p className="small mb-0" style={{ color: "var(--clarridge-gold)" }}><strong>Deadline:</strong> {new Date(p.end_date).toLocaleDateString("en-US", { day: "numeric", month: "long", year: "numeric" })}</p>
                        )}
                        {p.status === "upcoming" && p.start_date && (
                          <p className="small mb-0" style={{ color: "var(--clarridge-gold)" }}><strong>Opens:</strong> {new Date(p.start_date).toLocaleDateString("en-US", { month: "long", year: "numeric" })}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {filteredProgrammes.length > 5 && (
                  <button type="button" className="btn btn-link text-navy fw-semibold text-decoration-none p-0 mt-4" onClick={() => setShowAllProgrammes((prev) => !prev)}>{showAllProgrammes ? "Show Less ↑" : "View All Programmes →"}</button>
                )}
              </>
            )}
          </div>
        </section>

        <section id="observatory" className="py-5" style={{ backgroundColor: "rgba(255, 255, 255, 0.97)" }}>
          <div className="container">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span style={{ width: "30px", height: "1px", backgroundColor: "var(--clarridge-gold)" }} />
              <span className="text-uppercase fw-semibold" style={{ color: "var(--clarridge-gold)", fontSize: "0.8rem", letterSpacing: "1px" }}>The Observatory</span>
            </div>
            <h2 className="text-navy fw-normal mb-4" style={{ fontSize: "2rem" }}>Ideas. Research. Perspective.</h2>
            <div className="d-flex flex-wrap gap-4 mb-4" style={{ borderBottom: "1px solid #e5e7eb" }}>
              {OBSERVATORY_TABS.map((tab) => (
                <button key={tab.value} type="button" className="btn btn-link text-decoration-none p-0 pb-2 fw-semibold" style={{ fontSize: "0.95rem", color: observatoryTab === tab.value ? "var(--clarridge-navy)" : "#6c757d", borderBottom: observatoryTab === tab.value ? "2px solid var(--clarridge-gold)" : "2px solid transparent", borderRadius: 0 }} onClick={() => setObservatoryTab(tab.value)}>{tab.label}</button>
              ))}
            </div>
            {loadingObservatory ? (
              <ColdStartLoader />
            ) : (
              <>
                {observatoryTab === "featured" && featuredPost && (
                  <div className="row g-4 mb-4" role="button" onClick={() => navigate(`/observatory/${featuredPost.slug}`)} style={{ cursor: "pointer" }}>
                    <div className="col-12 col-md-6">
                      {featuredPost.cover_image ? (
                        <img src={featuredPost.cover_image} alt={featuredPost.title} style={{ width: "100%", height: "320px", objectFit: "cover", borderRadius: "6px" }} />
                      ) : (
                        <div className="bg-light d-flex align-items-center justify-content-center text-muted" style={{ width: "100%", height: "320px", borderRadius: "6px", fontSize: "3rem" }}>🖼️</div>
                      )}
                    </div>
                    <div className="col-12 col-md-6 d-flex flex-column justify-content-center">
                      <div className="small fw-semibold mb-2" style={{ color: "var(--clarridge-gold)" }}>FEATURED · {categoryDisplayLabel(featuredPost.category).toUpperCase()}</div>
                      <h3 className="text-navy fw-normal mb-3">{featuredPost.title}</h3>
                      <p className="text-muted mb-3">{featuredPost.summary}</p>
                      <p className="small text-muted mb-0">{new Date(featuredPost.date_posted).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {featuredPost.read_time_minutes} min read</p>
                    </div>
                  </div>
                )}
                {observatoryFiltered.length === 0 ? (
                  <p className="text-muted">No posts in this category yet.</p>
                ) : (
                  <div className="row g-4">
                    {observatoryFiltered.map((post) => (
                      <div className="col-12 col-md-4" key={post.id}>
                        <div role="button" onClick={() => navigate(`/observatory/${post.slug}`)} style={{ cursor: "pointer" }}>
                          {post.cover_image ? (
                            <img src={post.cover_image} alt={post.title} style={{ width: "100%", height: "180px", objectFit: "cover", borderRadius: "6px" }} className="mb-3" />
                          ) : (
                            <div className="bg-light d-flex align-items-center justify-content-center text-muted mb-3" style={{ width: "100%", height: "180px", borderRadius: "6px", fontSize: "2rem" }}>🖼️</div>
                          )}
                          <div className="small fw-semibold mb-1" style={{ color: "var(--clarridge-gold)" }}>{categoryDisplayLabel(post.category).toUpperCase()}</div>
                          <h6 className="text-navy fw-bold mb-2">{post.title}</h6>
                          <p className="small text-muted mb-0">{new Date(post.date_posted).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })} · {post.read_time_minutes} min read</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </section>

        <section id="team-members" className="py-5" style={{ backgroundColor: "rgba(248, 249, 251, 0.97)" }}>
          <div className="container">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span style={{ width: "30px", height: "1px", backgroundColor: "var(--clarridge-gold)" }} />
              <span className="text-uppercase fw-semibold" style={{ color: "var(--clarridge-gold)", fontSize: "0.8rem", letterSpacing: "1px" }}>Team Members</span>
            </div>
            <h2 className="text-navy fw-normal mb-4" style={{ fontSize: "1.75rem" }}>The people behind The Clarridge.</h2>
            {loadingTeamMembers ? (
              <ColdStartLoader />
            ) : teamMembers.length === 0 ? (
              <p className="text-muted">No team members to show yet.</p>
            ) : (
              <>
                <div className="row g-3 mb-4">
                  {(showAllTeamMembers ? teamMembers : teamMembers.slice(0, 4)).map((m) => (
                    <div className="col-12 col-md-6 col-lg-3" key={m.id}>
                      <div className="bg-white p-4 text-center h-100" role="button" onClick={() => setSelectedTeamMember(m)} style={{ border: "1px solid #e5e7eb", borderRadius: "6px", cursor: "pointer", transition: "box-shadow 0.15s ease" }} onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(10,31,68,0.1)")} onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}>
                        {m.photo ? (
                          <img src={m.photo} alt={m.name} style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover" }} className="mb-3" />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3" style={{ width: "64px", height: "64px", backgroundColor: "var(--clarridge-navy)", color: "var(--clarridge-gold)", fontWeight: "bold" }}>{initials(m.name)}</div>
                        )}
                        <div className="fw-bold text-navy">{m.name}</div>
                        {m.office && <div className="small text-muted">{m.office}</div>}
                        {m.contact && <div className="small text-muted">{m.contact}</div>}
                        {m.bio && (
                          <p className="small text-muted mt-2 mb-0" style={{ fontStyle: "italic" }}>{m.bio.length > 80 ? `${m.bio.slice(0, 80)}...` : m.bio}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {teamMembers.length > 4 && (
                  <button type="button" className="btn btn-link text-navy fw-semibold text-decoration-none p-0" onClick={() => setShowAllTeamMembers((prev) => !prev)}>{showAllTeamMembers ? "Show Less ↑" : "View All Members →"}</button>
                )}
              </>
            )}
          </div>
        </section>

        <section id="impact" className="py-5" style={{ backgroundColor: "rgba(10, 31, 68, 0.97)" }}>
          <div className="container">
            <div className="row align-items-center g-4">
              <div className="col-12 col-md-7">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span style={{ width: "30px", height: "1px", backgroundColor: "var(--clarridge-gold)" }} />
                  <span className="text-uppercase fw-semibold" style={{ color: "var(--clarridge-gold)", fontSize: "0.8rem", letterSpacing: "1px" }}>Our Impact</span>
                </div>
                <h2 className="text-white fw-normal mb-0" style={{ fontSize: "1.75rem" }}>Building a culture of possibility.</h2>
              </div>
              <div className="col-12 col-md-5">
                <div className="d-flex justify-content-around text-white text-center">
                  <div>
                    <div className="fw-bold" style={{ fontSize: "1.75rem" }}>{impactStats.studentsReached !== null ? `${impactStats.studentsReached}+` : "—"}</div>
                    <div className="small text-white-50">Students Reached</div>
                  </div>
                  <div>
                    <div className="fw-bold" style={{ fontSize: "1.75rem" }}>{impactStats.universityCount !== null ? `${impactStats.universityCount}+` : "—"}</div>
                    <div className="small text-white-50">Universities</div>
                  </div>
                  <div>
                    <div className="fw-bold" style={{ fontSize: "1.75rem" }}>{impactStats.programmeCount !== null ? `${impactStats.programmeCount}+` : "—"}</div>
                    <div className="small text-white-50">Programmes</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="collegium" className="py-5" style={{ backgroundColor: "rgba(255, 255, 255, 0.97)" }}>
          <div className="container">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span style={{ width: "30px", height: "1px", backgroundColor: "var(--clarridge-gold)" }} />
              <span className="text-uppercase fw-semibold" style={{ color: "var(--clarridge-gold)", fontSize: "0.8rem", letterSpacing: "1px" }}>The Clarridge Collegium</span>
            </div>
            <h2 className="text-navy fw-normal mb-3" style={{ fontSize: "1.75rem" }}>Students at the table.</h2>
            <p className="text-muted mb-4" style={{ maxWidth: "600px" }}>The Collegium is The Clarridge's student advisory body — a forum through which students contribute perspective, counsel and ideas to the institution.</p>
            {loadingMembers ? (
              <ColdStartLoader />
            ) : allMembers.length === 0 ? (
              <p className="text-muted">No members to show yet.</p>
            ) : (
              <>
                <div className="row g-3 mb-4">
                  {(showAllMembers ? allMembers : allMembers.slice(0, 4)).map((m) => (
                    <div className="col-12 col-md-6 col-lg-3" key={m.id}>
                      <div className="bg-white p-4 text-center h-100" role="button" onClick={() => setSelectedMember(m)} style={{ border: "1px solid #e5e7eb", borderRadius: "6px", cursor: "pointer", transition: "box-shadow 0.15s ease" }} onMouseEnter={(e) => (e.currentTarget.style.boxShadow = "0 4px 16px rgba(10,31,68,0.1)")} onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "none")}>
                        {m.photo ? (
                          <img src={m.photo} alt={m.member_name} style={{ width: "64px", height: "64px", borderRadius: "50%", objectFit: "cover" }} className="mb-3" />
                        ) : (
                          <div className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3" style={{ width: "64px", height: "64px", backgroundColor: "var(--clarridge-navy)", color: "var(--clarridge-gold)", fontWeight: "bold" }}>{initials(m.member_name)}</div>
                        )}
                        <div className="fw-bold text-navy">{m.member_name}</div>
                        <div className="small text-muted">{m.school}, {m.field}</div>
                        {m.bio && (
                          <p className="small text-muted mt-2 mb-0" style={{ fontStyle: "italic" }}>{m.bio.length > 80 ? `${m.bio.slice(0, 80)}...` : m.bio}</p>
                        )}
                        <div className="small fw-semibold mt-2" style={{ color: "var(--clarridge-gold)" }}>Member, The Collegium</div>
                      </div>
                    </div>
                  ))}
                </div>
                {allMembers.length > 4 && (
                  <button type="button" className="btn btn-link text-navy fw-semibold text-decoration-none p-0" onClick={() => setShowAllMembers((prev) => !prev)}>{showAllMembers ? "Show Less ↑" : "View All Members →"}</button>
                )}
              </>
            )}
          </div>
        </section>

        <section id="review" className="py-5" style={{ backgroundColor: "rgba(248, 249, 251, 0.97)" }}>
          <div className="container">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span style={{ width: "30px", height: "1px", backgroundColor: "var(--clarridge-gold)" }} />
              <span className="text-uppercase fw-semibold" style={{ color: "var(--clarridge-gold)", fontSize: "0.8rem", letterSpacing: "1px" }}>Voices</span>
            </div>
            <h2 className="text-navy fw-normal mb-4" style={{ fontSize: "1.75rem" }}>What they say.</h2>
            {loadingTestimonials ? (
              <ColdStartLoader />
            ) : testimonials.length === 0 ? (
              <p className="text-muted">No testimonials yet.</p>
            ) : (
              <>
                <div className="row g-3 mb-4">
                  {(showAllTestimonials ? testimonials : testimonials.slice(0, 3)).map((t) => (
                    <div className="col-12 col-md-6 col-lg-3" key={t.id}>
                      <div className="bg-white p-4 h-100" style={{ border: "1px solid #e5e7eb", borderRadius: "6px" }}>
                        <div style={{ fontSize: "1.5rem", color: "var(--clarridge-gold)" }}>&ldquo;</div>
                        <p className="text-muted small mb-3" style={{ minHeight: "80px" }}>{t.content}</p>
                        <div className="d-flex align-items-center gap-2 pt-2" style={{ borderTop: "1px solid #e5e7eb" }}>
                          <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0" style={{ width: "32px", height: "32px", backgroundColor: "var(--clarridge-navy)", color: "#fff", fontSize: "0.8rem", fontWeight: "bold" }}>{t.submitted_by?.[0]?.toUpperCase()}</div>
                          <div>
                            <div className="small fw-bold text-navy">{t.submitted_by}</div>
                            <div className="small text-muted">{t.programme}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  {!showAllTestimonials && (
                    <div className="col-12 col-md-6 col-lg-3">
                      <div className="p-4 h-100 d-flex flex-column justify-content-center" style={{ backgroundColor: "#f0f1f3", borderRadius: "6px" }}>
                        <div className="fw-bold text-navy mb-1">Share your experience</div>
                        <p className="small text-muted mb-3">Your story can inspire someone else.</p>
                        <span role="button" className="small fw-semibold" style={{ color: "var(--clarridge-gold)" }} onClick={openShareStoryModal}>Share Your Story →</span>
                      </div>
                    </div>
                  )}
                </div>
                {testimonials.length > 3 && (
                  <button type="button" className="btn btn-link text-navy fw-semibold text-decoration-none p-0" onClick={() => setShowAllTestimonials((prev) => !prev)}>{showAllTestimonials ? "Show Less ↑" : "View All Reviews →"}</button>
                )}
              </>
            )}
          </div>
        </section>

        <section id="contact" className="py-5" style={{ backgroundColor: "rgba(255, 255, 255, 0.97)" }}>
          <div className="container">
            <div className="d-flex align-items-center gap-2 mb-2">
              <span style={{ width: "30px", height: "1px", backgroundColor: "var(--clarridge-gold)" }} />
              <span className="text-uppercase fw-semibold" style={{ color: "var(--clarridge-gold)", fontSize: "0.8rem", letterSpacing: "1px" }}>Get in Touch</span>
            </div>
            <h2 className="text-navy fw-normal mb-4" style={{ fontSize: "1.75rem" }}>We&apos;d love to hear from you.</h2>
            <div className="row g-4">
              <div className="col-12 col-md-5">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span>✉️</span>
                  <a href="mailto:theclarridge@gmail.com" className="text-navy text-decoration-none">theclarridge@gmail.com</a>
                </div>
                <div className="d-flex align-items-center gap-2 mb-3">
                  <span>📞</span>
                  <span className="text-navy">+234 801 234 5678</span>
                </div>
                <div className="d-flex align-items-center gap-2 mb-4">
                  <span>📍</span>
                  <span className="text-navy">Lagos, Nigeria</span>
                </div>
                <div className="d-flex gap-3">
                  <a href="https://www.instagram.com/theclarridge?igsi=dHpmbm5xZzlrMzkx&utm_source=qr" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: "40px", height: "40px", backgroundColor: "var(--clarridge-navy)", color: "#fff", textDecoration: "none" }}>IG</a>
                  <a href="https://www.linkedin.com/company/the-clarridge/" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: "40px", height: "40px", backgroundColor: "var(--clarridge-navy)", color: "#fff", textDecoration: "none" }}>in</a>
                  <a href="https://x.com/theclarridge?s=11" target="_blank" rel="noopener noreferrer" className="d-flex align-items-center justify-content-center rounded-circle" style={{ width: "40px", height: "40px", backgroundColor: "var(--clarridge-navy)", color: "#fff", textDecoration: "none" }}>X</a>
                </div>
              </div>
              <div className="col-12 col-md-7">
                {contactSuccess && <div className="alert alert-success py-2 small">{contactSuccess}</div>}
                {contactError && <div className="alert alert-danger py-2 small">{contactError}</div>}
                <form onSubmit={handleContactSubmit}>
                  <div className="mb-3">
                    <label className="small fw-semibold mb-1 d-block">Your Name</label>
                    <input type="text" className="form-control" value={contactForm.name} onChange={(e) => setContactForm({ ...contactForm, name: e.target.value })} disabled={submittingContact} required />
                  </div>
                  <div className="mb-3">
                    <label className="small fw-semibold mb-1 d-block">Your Email</label>
                    <input type="email" className="form-control" value={contactForm.email} onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })} disabled={submittingContact} required />
                  </div>
                  <div className="mb-4">
                    <label className="small fw-semibold mb-1 d-block">Subject</label>
                    <input type="text" className="form-control" value={contactForm.subject} onChange={(e) => setContactForm({ ...contactForm, subject: e.target.value })} disabled={submittingContact} required />
                  </div>
                  <div className="mb-4">
                    <label className="small fw-semibold mb-1 d-block">Message</label>
                    <textarea className="form-control" rows={4} value={contactForm.message} onChange={(e) => setContactForm({ ...contactForm, message: e.target.value })} disabled={submittingContact} required />
                  </div>
                  <button type="submit" className="btn btn-navy px-4" disabled={submittingContact}>{submittingContact ? "Sending..." : "Send Message"}</button>
                </form>
              </div>
            </div>
          </div>
        </section>

        <footer className="py-4" style={{ backgroundColor: "rgba(10, 31, 68, 0.97)" }}>
          <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-2 text-white-50 small">
            <div>© 2026 The Clarridge</div>
            <div>theclarridge@gmail.com · Lagos, Nigeria</div>
          </div>
        </footer>

        {selectedProgramme && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(6, 21, 48, 0.6)", zIndex: 1070 }} onClick={() => setSelectedProgramme(null)}>
            <div className="bg-white rounded overflow-hidden" style={{ maxWidth: "480px", width: "90%", maxHeight: "85vh", overflowY: "auto" }} onClick={(e) => e.stopPropagation()}>
              {selectedProgramme.cover_image && (
                <img src={selectedProgramme.cover_image} alt={selectedProgramme.name} style={{ width: "100%", height: "180px", objectFit: "cover" }} />
              )}
              <div className="p-4">
                <div className="d-flex justify-content-between align-items-start mb-3">
                  <span className="badge rounded-pill fw-semibold px-3 py-2 text-uppercase" style={{ ...statusPillStyle(selectedProgramme.status), fontSize: "0.7rem", border: "1px solid" }}>● {statusLabel(selectedProgramme.status)}</span>
                  <button type="button" className="btn-close" onClick={() => setSelectedProgramme(null)} />
                </div>
                <h4 className="text-navy fw-bold mb-3">{selectedProgramme.name}</h4>
                {selectedProgramme.description && <p className="text-muted mb-3">{selectedProgramme.description}</p>}
                {(selectedProgramme.start_date || selectedProgramme.end_date) && (
                  <p className="small text-muted mb-4">{selectedProgramme.start_date || "—"} → {selectedProgramme.end_date || "—"}</p>
                )}
                <button type="button" className="btn w-100 fw-bold py-2" style={{ backgroundColor: "var(--clarridge-gold)", borderColor: "var(--clarridge-gold)", color: "#fff" }} onClick={() => navigate("/apply")}>Apply Now</button>
              </div>
            </div>
          </div>
        )}

        {selectedMember && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(6, 21, 48, 0.6)", zIndex: 1070 }} onClick={() => setSelectedMember(null)}>
            <div className="bg-white rounded p-4 text-center" style={{ maxWidth: "360px", width: "90%" }} onClick={(e) => e.stopPropagation()}>
              <div className="d-flex justify-content-end mb-2">
                <button type="button" className="btn-close" onClick={() => setSelectedMember(null)} />
              </div>
              {selectedMember.photo ? (
                <img src={selectedMember.photo} alt={selectedMember.member_name} style={{ width: "96px", height: "96px", borderRadius: "50%", objectFit: "cover" }} className="mb-3" />
              ) : (
                <div className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3" style={{ width: "96px", height: "96px", backgroundColor: "var(--clarridge-navy)", color: "var(--clarridge-gold)", fontWeight: "bold", fontSize: "1.5rem" }}>{initials(selectedMember.member_name)}</div>
              )}
              <h5 className="text-navy fw-bold mb-1">{selectedMember.member_name}</h5>
              <p className="text-muted mb-2">{selectedMember.school}, {selectedMember.field}</p>
              {selectedMember.bio && <p className="text-muted small mb-2" style={{ lineHeight: 1.6 }}>{selectedMember.bio}</p>}
              <div className="small fw-semibold" style={{ color: "var(--clarridge-gold)" }}>Member, The Collegium</div>
            </div>
          </div>
        )}

        {selectedTeamMember && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(6, 21, 48, 0.6)", zIndex: 1070 }} onClick={() => setSelectedTeamMember(null)}>
            <div className="bg-white rounded p-4 text-center" style={{ maxWidth: "360px", width: "90%" }} onClick={(e) => e.stopPropagation()}>
              <div className="d-flex justify-content-end mb-2">
                <button type="button" className="btn-close" onClick={() => setSelectedTeamMember(null)} />
              </div>
              {selectedTeamMember.photo ? (
                <img src={selectedTeamMember.photo} alt={selectedTeamMember.name} style={{ width: "96px", height: "96px", borderRadius: "50%", objectFit: "cover" }} className="mb-3" />
              ) : (
                <div className="d-flex align-items-center justify-content-center rounded-circle mx-auto mb-3" style={{ width: "96px", height: "96px", backgroundColor: "var(--clarridge-navy)", color: "var(--clarridge-gold)", fontWeight: "bold", fontSize: "1.5rem" }}>{initials(selectedTeamMember.name)}</div>
              )}
              <h5 className="text-navy fw-bold mb-1">{selectedTeamMember.name}</h5>
              {selectedTeamMember.office && <p className="text-muted small mb-1">{selectedTeamMember.office}</p>}
              {selectedTeamMember.contact && <p className="text-muted small mb-2">{selectedTeamMember.contact}</p>}
              {selectedTeamMember.bio && <p className="text-muted small mb-0" style={{ lineHeight: 1.6 }}>{selectedTeamMember.bio}</p>}
            </div>
          </div>
        )}

        {showShareStoryModal && (
          <div className="position-fixed top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" style={{ backgroundColor: "rgba(6, 21, 48, 0.6)", zIndex: 1070 }} onClick={closeShareStoryModal}>
            <div className="bg-white rounded p-4" style={{ maxWidth: "440px", width: "90%" }} onClick={(e) => e.stopPropagation()}>
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="text-navy fw-bold mb-0">Share Your Story</h5>
                <button type="button" className="btn-close" onClick={closeShareStoryModal} disabled={submittingStory} />
              </div>
              {storySuccess ? (
                <div className="alert alert-success">{storySuccess}</div>
              ) : (
                <>
                  {storyError && <div className="alert alert-danger py-2 small">{storyError}</div>}
                  <p className="small text-muted mb-3">Your story will be reviewed by our team before it's published.</p>
                  <form onSubmit={handleStorySubmit}>
                    <div className="mb-3">
                      <label className="small fw-semibold mb-1 d-block">Your Name</label>
                      <input type="text" className="form-control" value={storyForm.submitted_by} onChange={(e) => setStoryForm({ ...storyForm, submitted_by: e.target.value })} disabled={submittingStory} required />
                    </div>
                    <div className="mb-3">
                      <label className="small fw-semibold mb-1 d-block">Programme</label>
                      <input type="text" className="form-control" placeholder="e.g. Internship Placement" value={storyForm.programme} onChange={(e) => setStoryForm({ ...storyForm, programme: e.target.value })} disabled={submittingStory} required />
                    </div>
                    <div className="mb-4">
                      <label className="small fw-semibold mb-1 d-block">Your Story</label>
                      <textarea className="form-control" rows={4} value={storyForm.content} onChange={(e) => setStoryForm({ ...storyForm, content: e.target.value })} disabled={submittingStory} required />
                    </div>
                    <button type="submit" className="btn btn-navy w-100" disabled={submittingStory}>{submittingStory ? "Submitting..." : "Submit Your Story"}</button>
                  </form>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;