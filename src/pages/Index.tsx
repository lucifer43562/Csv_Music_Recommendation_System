import React, { useState, useCallback, useMemo } from 'react';
import { Upload, Search, Music, Download, TrendingUp, Users, Disc, Album } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';

interface Song {
  track_name: string;
  artist_name: string;
  album: string;
  duration: number;
  artist_genres: string;
  spotify_link: string;
  genre?: string;
  formatted_duration?: string;
}

const sampleData: Song[] = [
  {
    track_name: 'Tum Hi Ho',
    artist_name: 'Arijit Singh',
    album: 'Aashiqui 2',
    duration: 262000,
    artist_genres: 'modern bollywood',
    spotify_link: 'https://open.spotify.com/track/1234567890123456789012'
  },
  {
    track_name: 'Jeene Laga Hoon',
    artist_name: 'Arijit Singh',
    album: 'Ramaiya Vastavaiya',
    duration: 245000,
    artist_genres: 'modern bollywood',
    spotify_link: 'https://open.spotify.com/track/2345678901234567890123'
  },
  {
    track_name: 'Raabta',
    artist_name: 'Arijit Singh',
    album: 'Agent Vinod',
    duration: 298000,
    artist_genres: 'modern bollywood',
    spotify_link: 'https://open.spotify.com/track/3456789012345678901234'
  },
  {
    track_name: 'Tera Ban Jaunga',
    artist_name: 'Arijit Singh',
    album: 'Kabir Singh',
    duration: 213000,
    artist_genres: 'modern bollywood',
    spotify_link: 'https://open.spotify.com/track/4567890123456789012345'
  },
  {
    track_name: 'Dil Diyan Gallan',
    artist_name: 'Atif Aslam',
    album: 'Tiger Zinda Hai',
    duration: 267000,
    artist_genres: 'modern bollywood',
    spotify_link: 'https://open.spotify.com/track/5678901234567890123456'
  },
  {
    track_name: 'Ae Dil Hai Mushkil',
    artist_name: 'Arijit Singh',
    album: 'Ae Dil Hai Mushkil',
    duration: 293000,
    artist_genres: 'modern bollywood',
    spotify_link: 'https://open.spotify.com/track/6789012345678901234567'
  },
  {
    track_name: 'Channa Mereya',
    artist_name: 'Arijit Singh',
    album: 'Ae Dil Hai Mushkil',
    duration: 258000,
    artist_genres: 'modern bollywood',
    spotify_link: 'https://open.spotify.com/track/7890123456789012345678'
  },
  {
    track_name: 'Bulleya',
    artist_name: 'Amit Mishra',
    album: 'Sultan',
    duration: 241000,
    artist_genres: 'modern bollywood',
    spotify_link: 'https://open.spotify.com/track/8901234567890123456789'
  },
  {
    track_name: 'Gerua',
    artist_name: 'Arijit Singh',
    album: 'Dilwale',
    duration: 289000,
    artist_genres: 'modern bollywood',
    spotify_link: 'https://open.spotify.com/track/9012345678901234567890'
  },
  {
    track_name: 'Janam Janam',
    artist_name: 'Arijit Singh',
    album: 'Dilwale',
    duration: 267000,
    artist_genres: 'modern bollywood',
    spotify_link: 'https://open.spotify.com/track/0123456789012345678901'
  },
  {
    track_name: 'Tum Se Hi',
    artist_name: 'Mohit Chauhan',
    album: 'Jab We Met',
    duration: 279000,
    artist_genres: 'classic bollywood',
    spotify_link: 'https://open.spotify.com/track/1234567890123456789013'
  },
  {
    track_name: 'Kal Ho Naa Ho',
    artist_name: 'Sonu Nigam',
    album: 'Kal Ho Naa Ho',
    duration: 322000,
    artist_genres: 'classic bollywood',
    spotify_link: 'https://open.spotify.com/track/2345678901234567890124'
  },
  {
    track_name: 'Veer-Zaara',
    artist_name: 'Udit Narayan',
    album: 'Veer-Zaara',
    duration: 301000,
    artist_genres: 'classic bollywood',
    spotify_link: 'https://open.spotify.com/track/3456789012345678901235'
  },
  {
    track_name: 'Tujhe Kitna Chahne Lage',
    artist_name: 'Arijit Singh',
    album: 'Kabir Singh',
    duration: 287000,
    artist_genres: 'modern bollywood',
    spotify_link: 'https://open.spotify.com/track/4567890123456789012346'
  },
  {
    track_name: 'Bekhayali',
    artist_name: 'Sachet Tandon',
    album: 'Kabir Singh',
    duration: 394000,
    artist_genres: 'modern bollywood',
    spotify_link: 'https://open.spotify.com/track/5678901234567890123457'
  }
];

function inferGenre(song: Song): string {
  const genres = song.artist_genres.toLowerCase();
  const albumName = song.album.toLowerCase();

  if (genres.includes('chutney')) return 'Chutney';
  if (genres.includes('filmi') || genres.includes('modern bollywood')) return 'Filmi';
  if (genres.includes('bhajan') || genres.includes('ghazal') || genres.includes('sufi') || genres.includes('hare krishna')) return 'Bhajan';
  if (genres.includes('bhojpuri pop')) return 'Bhojpuri';
  if (genres.includes('afghan pop')) return 'Afghan';
  if (genres.includes('classic bollywood') || genres.includes('classic pakistani pop') || genres.includes('classic punjabi pop')) return 'Classic';
  if (albumName.includes('bhajan') || albumName.includes('devotional')) return 'Bhajan';
  if (albumName.includes('bhojpuri')) return 'Bhojpuri';
  if (albumName.includes('classic') || albumName.includes('retro')) return 'Classic';
  return 'Filmi';
}

function formatDuration(ms: number): string {
  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

function findClosestArtist(input: string, songs: Song[]): string | null {
  const artists = [...new Set(songs.map(s => s.artist_name))];
  const inputLower = input.toLowerCase();
  
  // Exact match
  const exactMatch = artists.find(artist => artist.toLowerCase() === inputLower);
  if (exactMatch) return exactMatch;
  
  // Partial match
  const partialMatch = artists.find(artist => 
    artist.toLowerCase().includes(inputLower) || 
    inputLower.includes(artist.toLowerCase())
  );
  if (partialMatch) return partialMatch;
  
  // Fuzzy match (simple implementation)
  const fuzzyMatch = artists.find(artist => {
    const artistLower = artist.toLowerCase();
    const words = inputLower.split(' ');
    return words.some(word => artistLower.includes(word) && word.length > 2);
  });
  
  return fuzzyMatch || null;
}

function calculateTextSimilarity(text1: string, text2: string): number {
  const words1 = text1.toLowerCase().split(/\s+/);
  const words2 = text2.toLowerCase().split(/\s+/);
  
  const intersection = words1.filter(word => words2.includes(word));
  const union = [...new Set([...words1, ...words2])];
  
  return intersection.length / union.length;
}

function getRecommendations(
  artistInput: string, 
  songs: Song[], 
  genreFilter?: string, 
  numRecommendations: number = 10
): { recommendations: Song[], matchedArtist: string | null, error?: string } {
  const matchedArtist = findClosestArtist(artistInput, songs);
  
  if (!matchedArtist) {
    return { recommendations: [], matchedArtist: null, error: 'No matching artist found' };
  }
  
  let filteredSongs = songs.filter(song => 
    song.artist_name.toLowerCase() === matchedArtist.toLowerCase()
  );
  
  if (genreFilter && genreFilter !== 'All') {
    filteredSongs = filteredSongs.filter(song => song.genre === genreFilter);
    if (filteredSongs.length === 0) {
      return { recommendations: [], matchedArtist, error: `No songs found for ${matchedArtist} in genre ${genreFilter}` };
    }
  }
  
  // Calculate similarities based on combined text (song name + album)
  const query = `${matchedArtist} ${artistInput}`.toLowerCase();
  const songsWithSimilarity = filteredSongs.map(song => ({
    ...song,
    similarity: calculateTextSimilarity(
      query,
      `${song.track_name} ${song.album} ${song.artist_name}`.toLowerCase()
    )
  }));
  
  // Sort by similarity and return top recommendations
  const recommendations = songsWithSimilarity
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, numRecommendations);
  
  return { recommendations, matchedArtist };
}

export default function Index() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [artistInput, setArtistInput] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [recommendations, setRecommendations] = useState<Song[]>([]);
  const [matchedArtist, setMatchedArtist] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [numRecommendations, setNumRecommendations] = useState(10);
  const { toast } = useToast();

  const processedSongs = useMemo(() => {
    const processed = (isDataLoaded ? songs : sampleData).map(song => ({
      ...song,
      genre: inferGenre(song),
      formatted_duration: formatDuration(song.duration)
    }));
    return processed;
  }, [songs, isDataLoaded]);

  const genres = useMemo(() => {
    if (matchedArtist) {
      const artistSongs = processedSongs.filter(song => 
        song.artist_name.toLowerCase() === matchedArtist.toLowerCase()
      );
      const artistGenres = [...new Set(artistSongs.map(song => song.genre))];
      return ['All', ...artistGenres.sort()];
    }
    const uniqueGenres = [...new Set(processedSongs.map(song => song.genre))];
    return ['All', ...uniqueGenres.sort()];
  }, [processedSongs, matchedArtist]);

  const stats = useMemo(() => ({
    totalSongs: processedSongs.length,
    totalArtists: new Set(processedSongs.map(s => s.artist_name)).size,
    totalGenres: new Set(processedSongs.map(s => s.genre)).size,
    totalAlbums: new Set(processedSongs.map(s => s.album)).size
  }), [processedSongs]);

  const artistGenres = useMemo(() => {
    if (!matchedArtist) return {};
    const artistSongs = processedSongs.filter(song => 
      song.artist_name.toLowerCase() === matchedArtist.toLowerCase()
    );
    const genreCounts: { [key: string]: number } = {};
    artistSongs.forEach(song => {
      if (song.genre) {
        genreCounts[song.genre] = (genreCounts[song.genre] || 0) + 1;
      }
    });
    return genreCounts;
  }, [matchedArtist, processedSongs]);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
        
        const parsedSongs: Song[] = [];
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',').map(v => v.trim().replace(/"/g, ''));
          const song: any = {};
          
          headers.forEach((header, index) => {
            const normalizedHeader = header.toLowerCase()
              .replace('track name', 'track_name')
              .replace('artist name', 'artist_name')
              .replace('duration (ms)', 'duration')
              .replace('artist genres', 'artist_genres')
              .replace('track uri', 'spotify_link');
            
            song[normalizedHeader] = values[index] || '';
          });
          
          if (song.track_name && song.artist_name) {
            // Convert Spotify URI to URL if needed
            if (song.spotify_link && song.spotify_link.includes('spotify:track:')) {
              song.spotify_link = `https://open.spotify.com/track/${song.spotify_link.split(':')[2]}`;
            }
            
            song.duration = parseInt(song.duration) || 0;
            parsedSongs.push(song as Song);
          }
        }
        
        setSongs(parsedSongs);
        setIsDataLoaded(true);
        toast({
          title: "File uploaded successfully!",
          description: `Loaded ${parsedSongs.length} songs`,
        });
      } catch (error) {
        toast({
          title: "Error parsing file",
          description: "Please make sure your CSV file has the correct format",
          variant: "destructive"
        });
      }
    };
    reader.readAsText(file);
  }, [toast]);

  const handleSearch = useCallback(() => {
    if (!artistInput.trim()) {
      toast({
        title: "Please enter an artist name",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay for better UX
    setTimeout(() => {
      const result = getRecommendations(
        artistInput, 
        processedSongs, 
        selectedGenre === 'All' ? undefined : selectedGenre,
        numRecommendations
      );
      
      if (result.error) {
        toast({
          title: result.error,
          variant: "destructive"
        });
        setRecommendations([]);
        setMatchedArtist(null);
      } else {
        setRecommendations(result.recommendations);
        setMatchedArtist(result.matchedArtist);
        toast({
          title: `Found ${result.recommendations.length} recommendations`,
          description: `Showing songs by ${result.matchedArtist}`,
        });
      }
      setIsSearching(false);
    }, 500);
  }, [artistInput, processedSongs, selectedGenre, numRecommendations, toast]);

  const downloadRecommendations = useCallback(() => {
    if (recommendations.length === 0) return;
    
    const csvContent = [
      'Track Name,Artist,Album,Genre,Duration,Spotify Link',
      ...recommendations.map(song => 
        `"${song.track_name}","${song.artist_name}","${song.album}","${song.genre}","${song.formatted_duration}","${song.spotify_link}"`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recommendations_${matchedArtist}_${selectedGenre}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: "Recommendations downloaded!",
    });
  }, [recommendations, matchedArtist, selectedGenre, toast]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-black to-orange-800">
      {/* Header */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 animate-fade-in">
              🎵 Hindi Songs Recommendation System
            </h1>
          </div>
          <p className="text-lg text-muted-foreground animate-fade-in">
            Discover amazing Hindi songs based on your favorite artists
          </p>
        </div>

        {/* File Upload Section */}
        <Card className="mb-8 bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Upload Your Music Data
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <Input
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="flex-1"
              />
              <div className="flex items-center gap-4">
                <label className="text-sm text-muted-foreground">Recommendations:</label>
                <Select value={numRecommendations.toString()} onValueChange={(value) => setNumRecommendations(parseInt(value))}>
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[5, 10, 15, 20].map(num => (
                      <SelectItem key={num} value={num.toString()}>{num}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {!isDataLoaded && (
              <p className="text-sm text-muted-foreground mt-2">
                📝 Using sample data. Upload your own CSV file for personalized recommendations.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="text-center bg-gradient-to-br from-primary to-primary/80 text-primary-foreground hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <Music className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalSongs}</div>
              <div className="text-sm opacity-90">Total Songs</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-secondary to-secondary/80 text-secondary-foreground hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <Users className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalArtists}</div>
              <div className="text-sm opacity-90">Artists</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-accent to-accent/80 text-accent-foreground hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <Disc className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalGenres}</div>
              <div className="text-sm opacity-90">Genres</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-gradient-to-br from-muted to-muted/80 text-muted-foreground hover:scale-105 transition-transform">
            <CardContent className="p-6">
              <Album className="h-8 w-8 mx-auto mb-2" />
              <div className="text-2xl font-bold">{stats.totalAlbums}</div>
              <div className="text-sm opacity-90">Albums</div>
            </CardContent>
          </Card>
        </div>

        {/* Search Section */}
        <Card className="mb-8 bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Get Song Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="e.g., Arijit Singh, Shreya Ghoshal, A.R. Rahman..."
                  value={artistInput}
                  onChange={(e) => setArtistInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  className="text-lg"
                />
              </div>
              <Select value={selectedGenre} onValueChange={setSelectedGenre}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Genre" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map(genre => (
                    <SelectItem key={genre} value={genre}>{genre}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="text-center">
              <Button 
                onClick={handleSearch} 
                disabled={isSearching || !artistInput.trim()}
                size="lg"
                className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90"
              >
                {isSearching ? (
                  <>
                    <TrendingUp className="mr-2 h-4 w-4 animate-spin" />
                    Finding Songs...
                  </>
                ) : (
                  <>
                    <Search className="mr-2 h-4 w-4" />
                    Get Recommendations
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results Section */}
        {matchedArtist && (
          <Card className="mb-8 bg-card/50 backdrop-blur-sm border-primary/20">
            <CardHeader>
              <CardTitle>🎤 Recommendations for: {matchedArtist}</CardTitle>
              {Object.keys(artistGenres).length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  <span className="text-sm font-medium">Available Genres:</span>
                  {Object.entries(artistGenres).map(([genre, count]) => (
                    <Badge key={genre} variant="secondary" className="bg-gradient-to-r from-primary/20 to-secondary/20">
                      {genre} ({count})
                    </Badge>
                  ))}
                </div>
              )}
            </CardHeader>
            <CardContent>
              {recommendations.length > 0 ? (
                <>
                  <div className="mb-4 flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      Found {recommendations.length} songs
                    </span>
                    <Button onClick={downloadRecommendations} variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download CSV
                    </Button>
                  </div>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Song</TableHead>
                          <TableHead>Artist</TableHead>
                          <TableHead>Album</TableHead>
                          <TableHead>Genre</TableHead>
                          <TableHead>Duration</TableHead>
                          <TableHead>Listen</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {recommendations.map((song, index) => (
                          <TableRow key={index} className="hover:bg-muted/50">
                            <TableCell className="font-medium">{song.track_name}</TableCell>
                            <TableCell>{song.artist_name}</TableCell>
                            <TableCell>{song.album}</TableCell>
                            <TableCell>
                              <Badge variant="outline">{song.genre}</Badge>
                            </TableCell>
                            <TableCell>{song.formatted_duration}</TableCell>
                            <TableCell>
                              {song.spotify_link && (
                                <a 
                                  href={song.spotify_link} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="text-primary hover:text-primary/80 transition-colors"
                                >
                                  🎧 Listen
                                </a>
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No recommendations found. Try a different artist or genre.
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* About Section */}
        <Card className="bg-card/50 backdrop-blur-sm border-primary/20">
          <CardHeader>
            <CardTitle>📊 About This System</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">How it works:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Artist similarity matching</li>
                  <li>• Genre-based filtering</li>
                  <li>• Text analysis for recommendations</li>
                  <li>• Intelligent fuzzy search</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Features:</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Upload your own music data</li>
                  <li>• Beautiful responsive design</li>
                  <li>• Download recommendations</li>
                  <li>• Real-time search results</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-muted-foreground">
          <p>Made with ❤️ using React | 🎵 Discover Amazing Hindi Music</p>
        </div>
      </div>
    </div>
  );
}
