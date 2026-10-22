// Footer Component

function renderFooter() {
    const footerContainer = document.getElementById('footerContainer');
    if (!footerContainer) return;

    footerContainer.innerHTML = `
        <footer class="footer">
            <div class="container">
                <div class="footer-grid">
                    <div class="footer-col">
                        <h4>🏛️ Campus Event Management</h4>
                        <p style="font-size: 0.9rem; margin-bottom: 1rem;">
                            An integrated Full-Stack platform designed for university students to explore, register, and organize campus seminars, workshops, and sports galas.
                        </p>
                        <p style="font-size: 0.8rem; color: #64748b;">
                            The University of Lahore (UOL) • Fall 2026
                        </p>
                    </div>

                    <div class="footer-col">
                        <h4>👥 Development Team</h4>
                        <ul class="team-list">
                            <li><span class="team-badge">Student 1 (Lead):</span> Umme Habiba (70176821@student.uol.edu.pk)</li>
                            <li><span class="team-badge">Student 2 (Frontend 1):</span> Zoha Khalid</li>
                            <li><span class="team-badge">Student 3 (Frontend 2):</span> Umme Habiba</li>
                            <li><span class="team-badge">Student 4 (Backend 1):</span> Laiba Aamir</li>
                            <li><span class="team-badge">Student 5 (DB & Testing):</span> Laiba Aamir</li>
                        </ul>
                    </div>

                    <div class="footer-col">
                        <h4>🛠️ Technologies</h4>
                        <ul class="footer-links" style="font-size: 0.85rem;">
                            <li>• Front End: HTML5, CSS3, Vanilla JS</li>
                            <li>• Back End: Node.js & Express.js</li>
                            <li>• Database: SQLite (Relational DB)</li>
                            <li>• Version Control: Git & GitHub Collaboration</li>
                            <li>• Auth: JWT & Role-Based Access Control</li>
                        </ul>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p>© 2026 Campus Event Management System. Created by Umme Habiba, Zoha Khalid, and Laiba Aamir.</p>
                </div>
            </div>
        </footer>
    `;
}

window.renderFooter = renderFooter;
