import streamlit as st
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from fuzzywuzzy import process
import warnings
import base64
warnings.filterwarnings("ignore")

# Page configuration
st.set_page_config(
    page_title="🎵 Hindi Songs Recommendation System",
    page_icon="🎵",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom CSS for colorful background and animations
def load_css():
    st.markdown("""
    <style>
    /* Main background with gradient */
    .stApp {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        min-height: 100vh;
    }
    
    /* Header styling */
    .main-header {
        background: linear-gradient(90deg, #ff6b6b, #feca57, #48dbfb, #ff9ff3);
        background-size: 400% 400%;
        animation: gradientShift 4s ease infinite;
        padding: 2rem;
        border-radius: 15px;
        text-align: center;
        margin-bottom: 2rem;
        box-shadow: 0 10px 30px rgba(0,0,0,0.3);
    }
    
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }
    
    .main-header h1 {
        color: white;
        font-size: 3rem;
        font-weight: bold;
        text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        margin: 0;
    }
    
    .main-header p {
        color: white;
        font-size: 1.2rem;
        margin: 0.5rem 0 0 0;
        text-shadow: 1px 1px 2px rgba(0,0,0,0.3);
    }
    
    /* Card styling */
    .custom-card {
        background: rgba(255, 255, 255, 0.95);
        padding: 2rem;
        border-radius: 20px;
        box-shadow: 0 15px 35px rgba(0,0,0,0.1);
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255,255,255,0.2);
        margin-bottom: 2rem;
    }
    
    /* Animated button */
    .stButton > button {
        background: linear-gradient(45deg, #ff6b6b, #feca57);
        color: white;
        border: none;
        padding: 0.75rem 2rem;
        border-radius: 50px;
        font-weight: bold;
        font-size: 1.1rem;
        transition: all 0.3s ease;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        position: relative;
        overflow: hidden;
    }
    
    .stButton > button:hover {
        transform: translateY(-3px);
        box-shadow: 0 10px 25px rgba(0,0,0,0.3);
        background: linear-gradient(45deg, #feca57, #ff6b6b);
    }
    
    .stButton > button:active {
        transform: translateY(-1px);
    }
    
    /* Input styling */
    .stTextInput > div > div > input {
        border-radius: 25px;
        border: 2px solid #e1e8ed;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: rgba(255,255,255,0.9);
    }
    
    .stTextInput > div > div > input:focus {
        border-color: #667eea;
        box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        background: white;
    }
    
    .stSelectbox > div > div > select {
        border-radius: 25px;
        border: 2px solid #e1e8ed;
        padding: 0.75rem 1.5rem;
        font-size: 1rem;
        transition: all 0.3s ease;
        background: rgba(255,255,255,0.9);
    }
    
    /* Results table styling */
    .stDataFrame {
        background: rgba(255,255,255,0.95);
        border-radius: 15px;
        overflow: hidden;
        box-shadow: 0 10px 30px rgba(0,0,0,0.1);
    }
    
    /* Success/Error messages */
    .stSuccess {
        background: linear-gradient(90deg, #56ab2f, #a8e6cf);
        border-radius: 15px;
        padding: 1rem;
        color: white;
        font-weight: bold;
    }
    
    .stError {
        background: linear-gradient(90deg, #ff416c, #ff4b2b);
        border-radius: 15px;
        padding: 1rem;
        color: white;
        font-weight: bold;
    }
    
    /* Sidebar styling */
    .css-1d391kg {
        background: linear-gradient(180deg, #667eea 0%, #764ba2 100%);
    }
    
    /* Loading animation */
    .stSpinner > div {
        border-top-color: #667eea !important;
    }
    
    /* Genre badges */
    .genre-badge {
        display: inline-block;
        background: linear-gradient(45deg, #667eea, #764ba2);
        color: white;
        padding: 0.3rem 0.8rem;
        border-radius: 20px;
        font-size: 0.9rem;
        margin: 0.2rem;
        font-weight: bold;
    }
    
    /* Stats cards */
    .stats-card {
        background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
        color: white;
        padding: 1.5rem;
        border-radius: 15px;
        text-align: center;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        transition: transform 0.3s ease;
    }
    
    .stats-card:hover {
        transform: translateY(-5px);
    }
    
    .stats-number {
        font-size: 2.5rem;
        font-weight: bold;
        margin: 0;
    }
    
    .stats-label {
        font-size: 1rem;
        opacity: 0.9;
        margin: 0;
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        .main-header h1 {
            font-size: 2rem;
        }
        
        .main-header p {
            font-size: 1rem;
        }
        
        .custom-card {
            padding: 1rem;
            margin-bottom: 1rem;
        }
        
        .stButton > button {
            width: 100%;
            margin-bottom: 1rem;
        }
    }
    </style>
    """, unsafe_allow_html=True)

def create_header():
    st.markdown("""
    <div class="main-header">
        <h1>🎵 Hindi Songs Recommendation System</h1>
        <p>Discover amazing Hindi songs based on your favorite artists</p>
    </div>
    """, unsafe_allow_html=True)

def load_sample_data():
    """Create sample data if no file is uploaded"""
    sample_data = {
        'track_name': [
            'Tum Hi Ho', 'Jeene Laga Hoon', 'Raabta', 'Tera Ban Jaunga', 'Dil Diyan Gallan',
            'Ae Dil Hai Mushkil', 'Channa Mereya', 'Bulleya', 'Gerua', 'Janam Janam',
            'Tum Se Hi', 'Kal Ho Naa Ho', 'Veer-Zaara', 'Tujhe Kitna Chahne Lage', 'Bekhayali'
        ],
        'artist_name': [
            'Arijit Singh', 'Arijit Singh', 'Arijit Singh', 'Arijit Singh', 'Atif Aslam',
            'Arijit Singh', 'Arijit Singh', 'Amit Mishra', 'Arijit Singh', 'Arijit Singh',
            'Mohit Chauhan', 'Sonu Nigam', 'Udit Narayan', 'Arijit Singh', 'Sachet Tandon'
        ],
        'album': [
            'Aashiqui 2', 'Ramaiya Vastavaiya', 'Agent Vinod', 'Kabir Singh', 'Tiger Zinda Hai',
            'Ae Dil Hai Mushkil', 'Ae Dil Hai Mushkil', 'Sultan', 'Dilwale', 'Dilwale',
            'Jab We Met', 'Kal Ho Naa Ho', 'Veer-Zaara', 'Kabir Singh', 'Kabir Singh'
        ],
        'duration': [
            262000, 245000, 298000, 213000, 267000, 293000, 258000, 241000, 289000, 267000,
            279000, 322000, 301000, 287000, 394000
        ],
        'artist_genres': [
            'modern bollywood', 'modern bollywood', 'modern bollywood', 'modern bollywood', 'modern bollywood',
            'modern bollywood', 'modern bollywood', 'modern bollywood', 'modern bollywood', 'modern bollywood',
            'classic bollywood', 'classic bollywood', 'classic bollywood', 'modern bollywood', 'modern bollywood'
        ],
        'spotify_link': [
            'spotify:track:1234567890123456789012', 'spotify:track:2345678901234567890123',
            'spotify:track:3456789012345678901234', 'spotify:track:4567890123456789012345',
            'spotify:track:5678901234567890123456', 'spotify:track:6789012345678901234567',
            'spotify:track:7890123456789012345678', 'spotify:track:8901234567890123456789',
            'spotify:track:9012345678901234567890', 'spotify:track:0123456789012345678901',
            'spotify:track:1234567890123456789013', 'spotify:track:2345678901234567890124',
            'spotify:track:3456789012345678901235', 'spotify:track:4567890123456789012346',
            'spotify:track:5678901234567890123457'
        ]
    }
    return pd.DataFrame(sample_data)

def preprocess_data(df):
    """Preprocess the uploaded data"""
    # Rename columns if they exist
    column_mapping = {
        'Track Name': 'track_name',
        'Artist Name': 'artist_name',
        'Track URI': 'spotify_link',
        'Album': 'album',
        'Duration (ms)': 'duration',
        'Artist Genres': 'artist_genres'
    }
    
    for old_col, new_col in column_mapping.items():
        if old_col in df.columns:
            df.rename(columns={old_col: new_col}, inplace=True)
    
    # Select relevant columns
    required_columns = ['track_name', 'artist_name', 'spotify_link', 'album', 'duration', 'artist_genres']
    available_columns = [col for col in required_columns if col in df.columns]
    df = df[available_columns]
    
    # Remove duplicates
    df = df.drop_duplicates(subset=['track_name', 'artist_name', 'album']).reset_index(drop=True)
    
    # Fill missing values
    for col in df.columns:
        if col in ['track_name', 'artist_name', 'album', 'artist_genres']:
            df[col] = df[col].fillna("")
    
    # Process Spotify links
    if 'spotify_link' in df.columns:
        df['spotify_link'] = df['spotify_link'].apply(
            lambda x: f"https://open.spotify.com/track/{x.split(':')[-1]}" 
            if isinstance(x, str) and 'spotify:track:' in x else ""
        )
    
    # Format duration
    if 'duration' in df.columns:
        df['formatted_duration'] = df['duration'].apply(
            lambda x: f"{int(x // 60000)}:{int((x % 60000) / 1000):02d}" 
            if pd.notnull(x) else "0:00"
        )
    
    return df

def infer_genre(row):
    """Infer genre from artist genres and album name"""
    genres = str(row.get('artist_genres', '')).lower()
    album_name = str(row.get('album', '')).lower()

    if 'chutney' in genres:
        return 'Chutney'
    elif 'filmi' in genres or 'modern bollywood' in genres:
        return 'Filmi'
    elif any(word in genres for word in ['bhajan', 'ghazal', 'sufi', 'hare krishna']):
        return 'Bhajan'
    elif 'bhojpuri pop' in genres:
        return 'Bhojpuri'
    elif 'afghan pop' in genres:
        return 'Afghan'
    elif any(word in genres for word in ['classic bollywood', 'classic pakistani pop', 'classic punjabi pop']):
        return 'Classic'
    elif any(word in album_name for word in ['bhajan', 'devotional']):
        return 'Bhajan'
    elif 'bhojpuri' in album_name:
        return 'Bhojpuri'
    elif any(word in album_name for word in ['classic', 'retro']):
        return 'Classic'
    else:
        return 'Filmi'

def find_closest_singer(user_input, df):
    """Find the closest matching singer using fuzzy matching"""
    singers = df['artist_name'].unique().tolist()
    singers = [singer for singer in singers if singer.strip()]  # Remove empty strings
    
    if not singers:
        return None
        
    best_match = process.extractOne(user_input, singers, score_cutoff=60)
    if best_match:
        return best_match[0]
    return None

def get_singer_genres(singer, df):
    """Get genres for a specific singer"""
    if singer:
        singer_songs = df[df['artist_name'].str.lower() == singer.lower()]
        if not singer_songs.empty:
            genre_counts = singer_songs['genre'].value_counts().to_dict()
            return sorted(genre_counts.keys()), genre_counts
    return [], {}

def train_tfidf(df):
    """Train TF-IDF vectorizer"""
    tfidf = TfidfVectorizer(stop_words='english', max_features=1000)
    combined_data = df['track_name'].fillna('') + ' ' + df['artist_name'].fillna('') + ' ' + df['album'].fillna('')
    vectorizer = tfidf.fit_transform(combined_data)
    return tfidf, vectorizer

def get_recommendations(user_input, df, num_recommendations=10, genre_filter=None):
    """Get song recommendations based on singer and optional genre filter"""
    matched_singer = find_closest_singer(user_input, df)
    
    if not matched_singer:
        return pd.DataFrame(), "No close matches found for the singer. Please check your input."
    
    singer_genres, genre_counts = get_singer_genres(matched_singer, df)
    
    if not singer_genres:
        return pd.DataFrame(), f"No genres found for singer '{matched_singer}'."
    
    unique_genres = sorted(df['genre'].unique().tolist())
    
    if genre_filter and genre_filter not in unique_genres:
        return pd.DataFrame(), f"Invalid genre '{genre_filter}'. Available genres: {', '.join(unique_genres)}"
    
    if genre_filter and genre_filter not in singer_genres:
        return pd.DataFrame(), f"Genre '{genre_filter}' not associated with '{matched_singer}'. Singer's genres: {', '.join(singer_genres)}"
    
    # Filter songs by singer
    df_filtered = df[df['artist_name'].str.lower() == matched_singer.lower()]
    
    if df_filtered.empty:
        return pd.DataFrame(), f"No songs found for '{matched_singer}'."
    
    # Apply genre filter if specified
    if genre_filter:
        df_filtered = df_filtered[df_filtered['genre'] == genre_filter]
        if df_filtered.empty:
            return pd.DataFrame(), f"No songs found for '{matched_singer}' in genre '{genre_filter}'."
    
    # Train TF-IDF and get recommendations
    tfidf, vectorizer = train_tfidf(df_filtered)
    combined_query = f"{matched_singer} {user_input}"
    user_vector = tfidf.transform([combined_query])
    user_similarity = cosine_similarity(user_vector, vectorizer)
    
    # Get top recommendations
    similar_indices = user_similarity.argsort()[0][-num_recommendations:][::-1]
    recommendations = df_filtered.iloc[similar_indices]
    
    # Select columns for display
    display_columns = ['track_name', 'artist_name', 'album', 'genre']
    if 'formatted_duration' in recommendations.columns:
        display_columns.append('formatted_duration')
    if 'spotify_link' in recommendations.columns:
        display_columns.append('spotify_link')
        
    recommendations = recommendations[display_columns]
    
    return recommendations, None, matched_singer, genre_counts

def display_stats(df):
    """Display dataset statistics"""
    col1, col2, col3, col4 = st.columns(4)
    
    with col1:
        st.markdown(f"""
        <div class="stats-card">
            <p class="stats-number">{len(df)}</p>
            <p class="stats-label">Total Songs</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown(f"""
        <div class="stats-card">
            <p class="stats-number">{df['artist_name'].nunique()}</p>
            <p class="stats-label">Artists</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown(f"""
        <div class="stats-card">
            <p class="stats-number">{df['genre'].nunique()}</p>
            <p class="stats-label">Genres</p>
        </div>
        """, unsafe_allow_html=True)
    
    with col4:
        if 'album' in df.columns:
            st.markdown(f"""
            <div class="stats-card">
                <p class="stats-number">{df['album'].nunique()}</p>
                <p class="stats-label">Albums</p>
            </div>
            """, unsafe_allow_html=True)

def main():
    load_css()
    create_header()
    
    # Sidebar for file upload and settings
    with st.sidebar:
        st.markdown("### 📁 Data Upload")
        uploaded_file = st.file_uploader(
            "Upload Hindi Songs CSV", 
            type=['csv'],
            help="Upload a CSV file with columns: Track Name, Artist Name, Album, Duration (ms), Artist Genres, Track URI"
        )
        
        st.markdown("### ⚙️ Settings")
        num_recommendations = st.slider("Number of recommendations", 5, 20, 10)
        
        st.markdown("### 📊 About")
        st.markdown("""
        This system uses machine learning to recommend Hindi songs based on:
        - **Artist similarity**
        - **Genre preferences**
        - **TF-IDF text analysis**
        - **Cosine similarity**
        """)
    
    # Load data
    if uploaded_file is not None:
        try:
            df = pd.read_csv(uploaded_file)
            df = preprocess_data(df)
            st.success("✅ File uploaded successfully!")
        except Exception as e:
            st.error(f"❌ Error loading file: {str(e)}")
            df = load_sample_data()
            st.info("📝 Using sample data instead.")
    else:
        df = load_sample_data()
        st.info("📝 Using sample data. Upload your own CSV file for personalized recommendations.")
    
    # Add genre column
    df['genre'] = df.apply(infer_genre, axis=1)
    
    # Display dataset statistics
    st.markdown('<div class="custom-card">', unsafe_allow_html=True)
    st.markdown("### 📊 Dataset Overview")
    display_stats(df)
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Main recommendation interface
    st.markdown('<div class="custom-card">', unsafe_allow_html=True)
    st.markdown("### 🎯 Get Song Recommendations")
    
    col1, col2 = st.columns([2, 1])
    
    with col1:
        singer_input = st.text_input(
            "🎤 Enter Singer's Name:",
            placeholder="e.g., Arijit Singh, Shreya Ghoshal, A.R. Rahman...",
            help="Type the name of your favorite Hindi singer"
        )
    
    with col2:
        unique_genres = ['All'] + sorted(df['genre'].unique().tolist())
        genre_filter = st.selectbox(
            "🎵 Genre (Optional):",
            unique_genres,
            help="Filter recommendations by genre"
        )
        
        if genre_filter == 'All':
            genre_filter = None
    
    # Search button
    col_center = st.columns([1, 2, 1])[1]
    with col_center:
        search_button = st.button("🔍 Get Recommendations", use_container_width=True)
    
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Process recommendations
    if search_button and singer_input:
        with st.spinner("🔄 Finding perfect songs for you..."):
            recommendations, error, matched_singer, genre_counts = get_recommendations(
                singer_input, df, num_recommendations, genre_filter
            )
            
            if error:
                st.error(f"❌ {error}")
            else:
                # Display matched singer and genres
                st.markdown('<div class="custom-card">', unsafe_allow_html=True)
                st.markdown(f"### 🎤 Recommendations for: **{matched_singer}**")
                
                if genre_counts:
                    st.markdown("**Available Genres:**")
                    genre_html = ""
                    for genre, count in sorted(genre_counts.items()):
                        genre_html += f'<span class="genre-badge">{genre} ({count})</span>'
                    st.markdown(genre_html, unsafe_allow_html=True)
                
                st.markdown('</div>', unsafe_allow_html=True)
                
                # Display recommendations
                st.markdown('<div class="custom-card">', unsafe_allow_html=True)
                st.markdown("### 🎵 Recommended Songs")
                
                if not recommendations.empty:
                    # Make Spotify links clickable if they exist
                    if 'spotify_link' in recommendations.columns:
                        recommendations['spotify_link'] = recommendations['spotify_link'].apply(
                            lambda x: f'<a href="{x}" target="_blank">🎧 Listen</a>' if x else ''
                        )
                    
                    st.write(recommendations.to_html(escape=False, index=False), unsafe_allow_html=True)
                    
                    # Download button for recommendations
                    csv = recommendations.to_csv(index=False)
                    st.download_button(
                        label="📥 Download Recommendations",
                        data=csv,
                        file_name=f"recommendations_{matched_singer}_{genre_filter or 'all_genres'}.csv",
                        mime="text/csv"
                    )
                else:
                    st.warning("⚠️ No recommendations found. Try a different singer or genre.")
                
                st.markdown('</div>', unsafe_allow_html=True)
    
    elif search_button and not singer_input:
        st.warning("⚠️ Please enter a singer's name to get recommendations.")
    
    # Footer
    st.markdown("---")
    st.markdown("""
    <div style="text-align: center; opacity: 0.7; padding: 2rem;">
        Made with ❤️ using Streamlit | 🎵 Discover Amazing Hindi Music
    </div>
    """, unsafe_allow_html=True)

if __name__ == "__main__":
    main()