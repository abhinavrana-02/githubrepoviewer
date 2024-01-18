const fetchButton = document.getElementById("fetch-button");
const repositoriesContainer = document.getElementById("repositories");

const itemsPerPage = 10; // Number of repositories to display per page
let currentPage = 1;

fetchButton.addEventListener("click", async() => {
    const username = document.getElementById("username").value;

    try {
        const response = await fetch(
            `https://api.github.com/users/${username}/repos`
        );
        const repositories = await response.json();

        const fetchedRepositories = repositories.slice(
            (currentPage - 1) * itemsPerPage,
            currentPage * itemsPerPage
        );

        repositoriesContainer.innerHTML = "";

        fetchedRepositories.forEach((repository) => {
            const repositoryElement = document.createElement("div");
            repositoryElement.innerHTML = `
        <h3>${repository.name}</h3>
        <p>Description: ${repository.description}</p>
        <a href="${repository.html_url}" target="_blank">View on GitHub</a>
      `;
            repositoriesContainer.appendChild(repositoryElement);
        });

        const paginationLinks = document.createElement("div");

        if (currentPage > 1) {
            paginationLinks.appendChild(
                createPaginationLink(currentPage - 1, "Previous")
            );
        }

        const totalPages = Math.ceil(repositories.length / itemsPerPage);

        if (currentPage < totalPages) {
            paginationLinks.appendChild(
                createPaginationLink(currentPage + 1, "Next")
            );
        }

        const paginationInfo = document.createElement("p");
        paginationInfo.textContent = `Page ${currentPage} of ${totalPages}`;

        repositoriesContainer.appendChild(paginationLinks);
        repositoriesContainer.appendChild(paginationInfo);
    } catch (error) {
        console.error("Error fetching repositories:", error);
        // Display an error message to the user
    }
});

const createPaginationLink = (pageNumber, text) => {
    const link = document.createElement("a");
    link.href = "#";
    link.textContent = text;
    link.addEventListener("click", () => {
        currentPage = pageNumber;
        fetchButton.click(); // Trigger a new fetch with the updated page
    });
    return link;
};