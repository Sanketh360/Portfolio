// Toggle Menu Icon
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

// Scroll Sections Active Link
let sections = document.querySelectorAll('section');
let navLinks = document.querySelectorAll('header nav a');

window.onscroll = () => {
    sections.forEach(sec => {
        let top = window.scrollY;
        let offset = sec.offsetTop - 150;
        let height = sec.offsetHeight;
        let id = sec.getAttribute('id');

        if (top >= offset && top < offset + height) {
            navLinks.forEach(links => {
                links.classList.remove('active');
                document.querySelector('header nav a[href*=' + id + ']').classList.add('active');
            });
        };
    });

    // Remove toggle icon and navbar when click navbar link (scroll)
    menuIcon.classList.remove('bx-x');
    navbar.classList.remove('active');
};

// Tab switching logic for About section
function openTab(tabName) {
    let i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        tabcontent[i].classList.remove("active-tab");
    }
    tablinks = document.getElementsByClassName("tab-btn");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    let selectedTab = document.getElementById(tabName);
    selectedTab.style.display = "block";

    // Slight delay to allow display block before adding opacity class
    setTimeout(() => {
        selectedTab.classList.add("active-tab");
    }, 10);

    event.currentTarget.classList.add("active");
}

// Fetch Data from JSON
async function loadResumeData() {
    try {
        const response = await fetch('resumeData.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        // 1. Home Section
        document.getElementById('hero-name').textContent = data.personalInfo.name;
        document.getElementById('hero-summary').textContent = data.personalInfo.summary;
        document.getElementById('linkedin-link').href = data.personalInfo.linkedin;
        document.getElementById('github-link').href = data.personalInfo.github;

        // Initialize Typed JS after getting the data
        const typed = new Typed('.multiple-text', {
            strings: [data.personalInfo.title, 'Backend Developer', 'Tech Enthusiast'],
            typeSpeed: 100,
            backSpeed: 100,
            backDelay: 1000,
            loop: true
        });

        // 2. About - Experience
        const expContainer = document.getElementById('experience');
        data.experience.forEach(exp => {
            let responsibilitiesHtml = exp.responsibilities.map(r => `<li>${r}</li>`).join('');
            expContainer.innerHTML += `
                <div class="tab-item">
                    <h4>${exp.role}</h4>
                    <p><strong>${exp.company}</strong> | ${exp.duration} | ${exp.location}</p>
                    <ul style="margin-top: 1rem; list-style-position: inside;">${responsibilitiesHtml}</ul>
                </div>
            `;
        });

        // 3. About - Education
        const eduContainer = document.getElementById('education');
        data.education.forEach(edu => {
            eduContainer.innerHTML += `
                <div class="tab-item">
                    <h4>${edu.degree}</h4>
                    <p><strong>${edu.institution}</strong></p>
                    <p>${edu.duration} | ${edu.score}</p>
                </div>
            `;
        });

        // 4. About - Certifications (Includes Achievements for simplicity)
        const certContainer = document.getElementById('certifications');
        data.certifications.forEach(cert => {
            certContainer.innerHTML += `
                <div class="tab-item">
                    <h4>${cert.name}</h4>
                    <p><strong>${cert.issuer}</strong></p>
                    <p>${cert.details}</p>
                </div>
            `;
        });

        // Adding Achievements mapping to the bottom of certs
        if (data.achievements && data.achievements.length > 0) {
            certContainer.innerHTML += `<div class="tab-item"><h4>Achievements</h4></div>`;
            data.achievements.forEach(ach => {
                certContainer.innerHTML += `
                    <div class="tab-item" style="margin-bottom:1rem;">
                        <p>• ${ach}</p>
                    </div>
                `;
            });
        }

        // 5. Skills
        const skillsContainer = document.getElementById('skills-container');
        const skillIcons = {
            "Languages": "bx-code-alt",
            "Frameworks": "bx-layer",
            "Database": "bx-data",
            "Core Concepts": "bx-brain",
            "Tools & Platforms": "bx-wrench"
        };

        for (const [category, skillsList] of Object.entries(data.skills)) {
            let tagsHtml = skillsList.map(skill => `<span class="skill-tag">${skill}</span>`).join('');
            let iconClass = skillIcons[category] || "bx-star";

            skillsContainer.innerHTML += `
                <div class="skill-category">
                    <i class='bx ${iconClass}'></i>
                    <h3>${category}</h3>
                    <div class="skill-tags">
                        ${tagsHtml}
                    </div>
                </div>
            `;
        }

        // 6. Projects
        const projectsContainer = document.getElementById('projects-container');
        data.projects.forEach(project => {
            let techHtml = project.techStack.map(tech => `<span>${tech}</span>`).join('');
            let pointsHtml = project.points.map(point => `<li>${point}</li>`).join('');

            projectsContainer.innerHTML += `
                <div class="project-box">
                    <h4>${project.name}</h4>
                    <p class="context">${project.context}</p>
                    <div class="project-tech">
                        ${techHtml}
                    </div>
                    <ul>
                        ${pointsHtml}
                    </ul>
                    <a href="${project.link}" target="_blank"><i class='bx bx-link-external'></i></a>
                </div>
            `;
        });

    } catch (error) {
        console.error("Failed to load resume data:", error);
        document.getElementById('hero-name').textContent = "Error Loading Data";
    }
}

// Ensure the first tab (experience) is displayed by default on load
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("experience").style.display = "block";
    loadResumeData();
});
