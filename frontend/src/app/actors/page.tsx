"use client";

export default function PushActorsPage() {
  const API_KEY = '56ef84025b5c2298b63a9827b2a6c633';

const bingoTime = async () => {
  try {
    const res = await fetch('http://localhost:8080/api/movies/filterMovies', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include' 
    });

    const text = await res.json();

    if (res.ok) {
      alert('Success: ' + text);
    } else {
      console.log('Failed: ' + text);
    }
  } catch (error) {
    console.error('Error calling filterMovies:', error);
    alert('Error: ');
  }
};


const fetchTop1000Movies = async () => {
  alert("Started fetching top 1000 movies...");
  console.log("[Start] fetchTop1000Movies");

  const API_KEY = '56ef84025b5c2298b63a9827b2a6c633';
  const totalPages = 50;
  const allMovies = [];

  // Step 1: Fetch top rated movies (paginated)
  console.log("[Step 1] Fetching top rated movie pages...");
  for (let page = 1; page <= totalPages; page++) {
    console.log(`Fetching page ${page} of ${totalPages}`);
    const res = await fetch(`https://api.themoviedb.org/3/movie/top_rated?api_key=${API_KEY}&page=${page}`);
    const data = await res.json();

    if (data.results) {
      allMovies.push(...data.results);
    } else {
      console.error(`Error fetching page ${page}`, data);
    }
  }

  const top1000 = allMovies.slice(0, 1000);
  console.log(`[Step 1] Finished fetching ${top1000.length} movies`);

  const enrichedMovies = [];

  // Step 2: Enrich each movie with runtime
  console.log("[Step 2] Fetching details for each movie to get runtime...");
  for (let i = 0; i < top1000.length; i++) {
    const movie = top1000[i];
    const movieId = movie.id;
    console.log(`Fetching details for movie ${i + 1}/${top1000.length}: "${movie.title}" (ID: ${movieId})`);

    try {
      const detailsRes = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`);
      const detailsData = await detailsRes.json();

      if (detailsData.runtime !== undefined) {
        enrichedMovies.push({
          tmdbId: movieId.toString(),
          title: movie.title,
          description: movie.overview,
          image: `https://image.tmdb.org/t/p/w500${movie.poster_path}`,
          runTime: detailsData.runtime,
          genres: movie.genre_ids.map(id => id.toString()),
          rating: Math.round(movie.vote_average),
        });
      } else {
        console.warn(`Runtime not found for movie: ${movie.title}`);
      }
    } catch (err) {
      console.error(`Error fetching details for movie ID ${movieId}`, err);
    }

    // Respect TMDB rate limit
    await new Promise(res => setTimeout(res, 250));
  }

  console.log(`[Step 2] Completed enriching movies. Total enriched: ${enrichedMovies.length}`);

  // Step 3: POST to backend
  console.log("[Step 3] Sending movies to backend...");
  try {
    const res = await fetch('http://localhost:8080/api/movies/storeMovies', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(enrichedMovies),
    });

    if (res.ok) {
      alert('Movies pushed successfully!');
      console.log("[Success] Movies pushed to backend");
    } else {
      alert('Failed to push movies');
      console.error("[Error] Failed to push movies", await res.text());
    }
  } catch (error) {
    alert('Error pushing to backend');
    console.error("[Exception] Push to backend failed", error);
  }

  console.log("[End] fetchTop1000Movies");
  return enrichedMovies;
};




  const handlePushActors = async () => {
    const totalPages = 25;
    const allActors = [];

    for (let page = 1; page <= totalPages; page++) {
      const response = await fetch(`https://api.themoviedb.org/3/person/popular?api_key=${API_KEY}&page=${page}`);
      const data = await response.json();

      if (data.results) {
        allActors.push(...data.results);
      } else {
        console.error(`Error fetching page ${page}:`, data);
      }
    }

    const topActors = allActors.slice(0, 500);

    // POST to backend (your backend expects ActorsListDto, so wrap array accordingly)
    const res = await fetch('http://localhost:8080/api/actors/storeAllActors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ actorsList: topActors }),
        credentials: 'include',
    });

    if (res.ok) {
      console.log(topActors)
      alert('Actors pushed successfully!');
    } else {
      alert('Failed to push actors');
    }

    return topActors;
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Push Top 1000 Movies and Top 500 Actors to Backend</h1>

      <button onClick={handlePushActors}>
        Push Actors
      </button>

      <button onClick={fetchTop1000Movies}>
        Push Movies
      </button>


         <button onClick={bingoTime}>
        Press for action
      </button>
    </div>
  );
}
