document.addEventListener("DOMContentLoaded", () => {

    const apiKey = "47d3fc543dd3415ab7c6a440d23c1a0e"
    const apiUrl = "https://newsapi.org/v2/everything?q="
    
    window.addEventListener('load', () => fetchNews("World"))
    

    async function fetchNews(query) {
        const newsCards = document.getElementById("news-cards");
        newsCards.innerHTML = "<p>Loading...</p>";

        try {
            const response = await fetch(`${apiUrl}${query}&apiKey=${apiKey}`);
            const data = await response.json();
            bindData(data.articles);
        } catch (error) {
            newsCards.innerHTML = "<p>Error fetching data</p>";
            console.error("Error fetching data:", error);
        }
    }
    
    // Function to bind news data to the DOM
    function bindData(articles) {
        const newsCards = document.getElementById("news-cards")
        const newsCardTemplate = document.getElementById("template-news-card")
        
        newsCards.innerHTML = ""
        
        articles.forEach(article => {
            if(!article.urlToImage) return;
            const cardClone = newsCardTemplate.content.cloneNode(true)
            fillDataInCard(cardClone, article)
            newsCards.appendChild(cardClone)
        });
        
    }
    
    function fillDataInCard(cardClone, article) {
        const newsImg = cardClone.querySelector("#news-img")
        const newsTitle = cardClone.querySelector("#news-title")
        const newsSource = cardClone.querySelector("#news-source")
        const newsDesc = cardClone.querySelector("#news-desc")
        
        newsImg.src = article.urlToImage
        newsTitle.innerHTML = article.title
        newsDesc.innerHTML = article.description
        
        const date = new Date(article.publishedAt).toLocaleDateString("en-US", {
            timeZone: "Asia/Jakarta"
        })
        
        newsSource.innerHTML = `${article.source.name} · ${date}`
        
        cardClone.firstElementChild.addEventListener("click", () =>{
            window.open(article.url, "_blank");
        })
    }
    
    // Variable to keep track of the currently selected navigation item
    let curSelectedNav = null;
    
    window.topicsclicked = function(id) {
        fetchNews(id);
        const navItem = document.getElementById(id);
        curSelectedNav?.classList.remove("active");
        curSelectedNav = navItem;
        curSelectedNav.classList.add("active");
    }
    
    const searchButton = document.getElementById("search-button");
    const searchText = document.getElementById("search-text");
    
    searchButton.addEventListener("click", () => {
        const query = searchText.value;
        if (!query) return;
        fetchNews(query);
        curSelectedNav?.classList.remove("active");
        curSelectedNav = null;
    });

    // Event listener for pressing Enter in the search bar
    searchText.addEventListener("keyup", (event) => {
        if (event.keyCode=== 13) {
            searchButton.click();
        }
    });
});
