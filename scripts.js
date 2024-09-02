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

    // Function to format numbers
    function formatNumber(num) {
        if (num >= 1e6) {
            return (num / 1e6).toFixed(1) + 'M';
        } else if (num >= 1e3) {
            return (num / 1e3).toFixed(1) + 'K';
        } else {
            return num;
        }
    }

    // Function to fetch YouTube channel data
    async function fetchYouTubeData() {
        try {
            // Fetch channel data including banner
            const channelResponse = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=snippet,brandingSettings,statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
            const channelData = await channelResponse.json();
            const channel = channelData.items[0];

            // Update the DOM with YouTube data
            document.getElementById('profile-picture').style.backgroundImage = `url(${channel.snippet.thumbnails.default.url})`;
            document.getElementById('profile-name').innerText = channel.snippet.title;
            document.getElementById('subs').innerText = formatNumber(channel.statistics.subscriberCount);
            document.getElementById('views').innerText = formatNumber(channel.statistics.viewCount);
            document.getElementById('videos-num').innerText = formatNumber(channel.statistics.videoCount);

            // Fetch and set the channel banner
            const bannerUrl = channel.brandingSettings.image.bannerExternalUrl;
            if (bannerUrl) {
                const aboutSection = document.querySelector('.about-section');
                const pseudoElement = document.querySelector('.about-section::before');
                aboutSection.style.backgroundImage = `url(${bannerUrl})`;
            } else {
                console.warn('Banner URL not found');
            }

            // Fetch the latest videos
            const latestVideosResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=3`);
            const latestVideosData = await latestVideosResponse.json();

            // Ensure the latest grid element exists
            const latestGrid = document.getElementById('latest-grid');
            if (latestGrid) {
                latestGrid.innerHTML = '';
                latestVideosData.items.forEach(video => {
                    const videoBox = document.createElement('div');
                    videoBox.className = 'video-box';
                    videoBox.innerHTML = `
                        <div class="thumbnail" style="background-image: url(${video.snippet.thumbnails.high.url})"></div>
                        <div class="video-title">${video.snippet.title}</div>
                    `;
                    videoBox.onclick = () => window.open(`https://www.youtube.com/watch?v=${video.id.videoId}`, '_blank');
                    latestGrid.appendChild(videoBox);
                });
            } else {
                console.error('Element with ID "latest-grid" not found');
            }

            // Fetch more videos for the videos section
            const moreVideosResponse = await fetch(`https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=9`);
            const moreVideosData = await moreVideosResponse.json();

            // Ensure the video grid element exists
            const videoGrid = document.getElementById('video-grid');
            if (videoGrid) {
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
            } else {
                console.error('Element with ID "video-grid" not found');
            }
        } catch (error) {
            console.error('Error fetching YouTube data:', error);
        }
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
