document.addEventListener('DOMContentLoaded', function() {
    const API_KEY = 'AIzaSyCuMcIOKzM8ecZ9Yj4v9LQn7tfI2kAjupg';
    const CHANNEL_ID = 'UCJhccCAmr6LSIsJvMx0U-BA';

    let clickCount = 0;
    const profilePicture = document.getElementById('profile-picture');

    profilePicture.addEventListener('click', () => {
        clickCount++;
        if (clickCount >= 10) {
            window.location.href = 'login.html';
        }
    });

    // Function to fetch YouTube channel data
    async function fetchYouTubeData() {
        const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
        const channelData = await channelResponse.json();
        const channel = channelData.items[0];

        // Update the DOM with YouTube data
        document.getElementById('profile-picture').style.backgroundImage = `url(${channel.snippet.thumbnails.default.url})`;
        document.getElementById('profile-name').innerText = channel.snippet.title;
        document.getElementById('subs').innerText = channel.statistics.subscriberCount;
        document.getElementById('views').innerText = channel.statistics.viewCount;
        document.getElementById('videos-num').innerText = channel.statistics.videoCount;

        // Fetch the latest videos
        const videosResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=3`);
        const videosData = await videosResponse.json();

        // Update the latest videos section
        const latestGrid = document.getElementById('latest-grid');
        latestGrid.innerHTML = '';
        videosData.items.forEach(video => {
            const videoBox = document.createElement('div');
            videoBox.className = 'video-box';
            videoBox.innerHTML = `
                <div class="thumbnail" style="background-image: url(${video.snippet.thumbnails.high.url})"></div>
                <div class="video-title">${video.snippet.title}</div>
            `;
            videoBox.onclick = () => window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`, '_blank');
            latestGrid.appendChild(videoBox);
        });

        // Fetch more videos for the videos section
        const moreVideosResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=9`);
        const moreVideosData = await moreVideosResponse.json();

        // Update the videos section
        const videoGrid = document.getElementById('video-grid');
        videoGrid.innerHTML = '';
        moreVideosData.items.forEach(video => {
            const videoBox = document.createElement('div');
            videoBox.className = 'video-box';
            videoBox.innerHTML = `
                <div class="thumbnail" style="background-image: url(${video.snippet.thumbnails.high.url})"></div>
                <div class="video-title">${video.snippet.title}</div>
            `;
            videoBox.onclick = () => window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`, '_blank');
            videoGrid.appendChild(videoBox);
        });
    }

    // Call the function to fetch YouTube data
    fetchYouTubeData();

    // Smooth scrolling for sidebar links
    document.querySelectorAll('.menu a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });
});
