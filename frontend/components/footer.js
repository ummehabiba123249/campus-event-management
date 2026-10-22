// Footer Component - Modernized & Branded

function renderFooter() {
    const footerContainer = document.getElementById('footerContainer');
    if (!footerContainer) return;

    footerContainer.innerHTML = `
        <footer class="footer">
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-col">
                        <h4>🏛️ Campus EventHub</h4>
                        <p style="font-size: 0.92rem; line-height: 1.6; margin-bottom: 1rem; color: var(--slate-400);">
                            The official next-generation Full-Stack event coordination platform designed for university students to explore, register, and organize campus seminars, workshops, sports galas, and tech competitions.
                        </p>
                        <p style="font-size: 0.82rem; color: #64748b; font-weight: 600;">
                            The University of Lahore (UOL) • Department of CS &amp; IT
                        </p>
                    </div>

                    <div class="footer-col">
                        <h4>👥 Software Engineering Team</h4>
                        <ul class="team-list">
                            <li><span class="team-badge">Student 1 (Team Lead):</span> Umme Habiba (70176821@student.uol.edu.pk)</li>
                            <li><span class="team-badge">Student 2 (Frontend 1):</span> Zoha Khalid</li>
                            <li><span class="team-badge">Student 3 (Frontend 2):</span> Umme Habiba</li>
                            <li><span class="team-badge">Student 4 (Backend 1):</span> Laiba Aamir</li>
                            <li><span class="team-badge">Student 5 (DB &amp; Testing):</span> Laiba Aamir</li>
                        </ul>
                    </div>

                    <div class="footer-col">
                        <h4>🛠️ Production Stack</h4>
                        <ul class="footer-links">
                            <li>• Modern Semantic HTML5 &amp; Custom CSS3 Design</li>
                            <li>• Node.js &amp; Express RESTful API Server</li>
                            <li>• SQLite Relational Database Engine</li>
                            <li>• JWT Authentication &amp; Role-Based Access</li>
                            <li>• Automated Testing &amp; CI/CD Pipelines</li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>© 2026 Campus Event Management System. Created by Umme Habiba, Zoha Khalid, and Laiba Aamir. All rights reserved.</p>
                </div>
            </div>
        </footer>
    `;
}

window.renderFooter = renderFooter;
