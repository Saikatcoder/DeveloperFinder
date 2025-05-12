const  inputValue =document.getElementById('usernameInput');
const searchButton =  document.getElementById('searchBtn');
const card =document.querySelector("#profileCard")


function getUserData(username){
    return fetch (`https://api.github.com/users/${username}`).then((raw)=>{
        if(!raw.ok) throw new Error("User not found")
            return raw.json();
    });
}
function getRepos(username){
   return fetch(`https://api.github.com/users/${username}/repos?per_page=100&sort=updated`).then((raw)=>{

        if(!raw.ok) throw new Error("Failed to fetch repos....");
        return raw.json()
    })

}

function profiledataDiv(details){
  try {
    let data =  ` <div class="flex items-center gap-6">
        <img class="w-24 h-24 rounded-full border-4 border-purple-500"
          src="${details.avatar_url}" alt="GitHub Avatar" />
        <div>
          <h2 class="text-2xl font-bold">${details.name}</h2>
          <p class="text-gray-300">${details.bio}</p>
          <p class="text-sm text-gray-400 mt-1">${details.location}</p>
        </div>
      </div>
      <div class="mt-6 grid grid-cols-3 gap-4 text-center">
        <div>
          <p class="text-xl font-bold">${details.followers}</p>
          <p class="text-gray-400">Followers</p>
        </div>
        <div>
          <p class="text-xl font-bold">${details.following}</p>
          <p class="text-gray-400">Following</p>
        </div>
        <div>
          <p class="text-xl font-bold">${details.public_repos}</p>
          <p class="text-gray-400">Repositories</p>
        </div>
      </div>`
      card.innerHTML = data
  } catch (error) {
    card.innerHTML= error;

  }
  
}

searchButton.addEventListener('click', (e) => {
  e.preventDefault();
  let userInputValue = inputValue.value.trim();

  if (userInputValue.length > 0) {
    getUserData(userInputValue).then(data => {
      profiledataDiv(data);        
      // Fetch and render chart
      getRepos(userInputValue).then(repos => {
        renderChart(repos);
        
      });
    });
  } else {
    alert("Please enter a username");
  }
});


  function renderChart(repos) {
  const repoNames = repos.map(repo => repo.name);
  const starCounts = repos.map(repo => repo.stargazers_count); // correct star count

  const ctx = document.getElementById('myChart').getContext('2d');

  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: repoNames,
      datasets: [{
        label: '⭐ Star Count',
        data: starCounts,
        backgroundColor: 'rgba(126, 236, 53, 0.74)',
        borderColor: 'rgb(39, 116, 6)',
        borderWidth: 1,
      }]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { display: true }
      },
      scales: {
        y: {
          beginAtZero: true
        },
        x: {
          ticks: {
            maxRotation: 90,
            minRotation: 45,
            autoSkip: false
          }
        }
      }
    }
  });
}
