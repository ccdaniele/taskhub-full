'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { Users, UserPlus, Search, Heart, MessageCircle, UserCheck, UserX } from 'lucide-react'

export default function SocialPage() {
  const { data: session, status } = useSession()
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [friendRequests, setFriendRequests] = useState([])
  const [friends, setFriends] = useState([])
  const [following, setFollowing] = useState([])
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (session?.apiToken) {
      fetchFriendRequests()
      fetchFriends()
      fetchFollowing()
      fetchSuggestions()
    }
  }, [session])

  const fetchWithAuth = async (url, options = {}) => {
    const response = await fetch(url, {
      ...options,
      headers: {
        'Authorization': `Bearer ${session?.apiToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    })
    return response
  }

  const fetchFriendRequests = async () => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/social/friend_requests`)
      if (response.ok) {
        const data = await response.json()
        setFriendRequests(data.friend_requests || [])
      }
    } catch (error) {
      console.error('Error fetching friend requests:', error)
    }
  }

  const fetchFriends = async () => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/social/friends`)
      if (response.ok) {
        const data = await response.json()
        setFriends(data.friends || [])
      }
    } catch (error) {
      console.error('Error fetching friends:', error)
    }
  }

  const fetchFollowing = async () => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/social/following`)
      if (response.ok) {
        const data = await response.json()
        setFollowing(data.following || [])
      }
    } catch (error) {
      console.error('Error fetching following:', error)
    }
  }

  const fetchSuggestions = async () => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/social/suggestions`)
      if (response.ok) {
        const data = await response.json()
        setSuggestions(data.suggestions || [])
      }
    } catch (error) {
      console.error('Error fetching suggestions:', error)
    }
  }

  const searchUsers = async () => {
    if (!searchQuery.trim()) return
    setLoading(true)
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/social/search_users?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.users || [])
      }
    } catch (error) {
      console.error('Error searching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const followUser = async (userId) => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/social/follow/${userId}`, {
        method: 'POST'
      })
      if (response.ok) {
        fetchFollowing()
        setSearchResults(prev => prev.map(user => 
          user.id === userId ? { ...user, is_following: true } : user
        ))
      }
    } catch (error) {
      console.error('Error following user:', error)
    }
  }

  const unfollowUser = async (userId) => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/social/unfollow/${userId}`, {
        method: 'DELETE'
      })
      if (response.ok) {
        fetchFollowing()
        setSearchResults(prev => prev.map(user => 
          user.id === userId ? { ...user, is_following: false } : user
        ))
      }
    } catch (error) {
      console.error('Error unfollowing user:', error)
    }
  }

  const sendFriendRequest = async (userId) => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/social/friend_request/${userId}`, {
        method: 'POST'
      })
      if (response.ok) {
        setSearchResults(prev => prev.map(user => 
          user.id === userId ? { ...user, relationship_status: 'friend_request_sent' } : user
        ))
      }
    } catch (error) {
      console.error('Error sending friend request:', error)
    }
  }

  const acceptFriendRequest = async (userId) => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/social/accept_friend_request/${userId}`, {
        method: 'POST'
      })
      if (response.ok) {
        fetchFriendRequests()
        fetchFriends()
      }
    } catch (error) {
      console.error('Error accepting friend request:', error)
    }
  }

  const declineFriendRequest = async (userId) => {
    try {
      const response = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}/social/decline_friend_request/${userId}`, {
        method: 'POST'
      })
      if (response.ok) {
        fetchFriendRequests()
      }
    } catch (error) {
      console.error('Error declining friend request:', error)
    }
  }

  if (status === 'loading') {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>
  }

  if (!session) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please sign in to access social features</h1>
          <a href="/auth/signin" className="bg-blue-500 text-white px-4 py-2 rounded">Sign In</a>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Social Hub</h1>
      
      {/* Search Users */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Find Friends</h2>
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search by username or email..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && searchUsers()}
            />
          </div>
          <button
            onClick={searchUsers}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Searching...' : 'Search'}
          </button>
        </div>
        
        {searchResults.length > 0 && (
          <div className="space-y-3">
            {searchResults.map(user => (
              <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">{user.username.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                    <p className="text-sm text-gray-500">{user.display_name}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {user.relationship_status === 'friends' ? (
                    <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">Friends</span>
                  ) : user.relationship_status === 'friend_request_sent' ? (
                    <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Request Sent</span>
                  ) : (
                    <button
                      onClick={() => sendFriendRequest(user.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600"
                    >
                      Add Friend
                    </button>
                  )}
                  {user.is_following ? (
                    <button
                      onClick={() => unfollowUser(user.id)}
                      className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300"
                    >
                      Unfollow
                    </button>
                  ) : (
                    <button
                      onClick={() => followUser(user.id)}
                      className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm hover:bg-purple-600"
                    >
                      Follow
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Friend Requests */}
        {friendRequests.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
              <UserPlus className="w-5 h-5 mr-2" />
              Friend Requests ({friendRequests.length})
            </h2>
            <div className="space-y-3">
              {friendRequests.map(request => (
                <div key={request.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{request.requester.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{request.requester.username}</p>
                      <p className="text-sm text-gray-500">{new Date(request.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => acceptFriendRequest(request.requester.id)}
                      className="px-3 py-1 bg-green-500 text-white rounded-full text-sm hover:bg-green-600 flex items-center"
                    >
                      <UserCheck className="w-4 h-4 mr-1" />
                      Accept
                    </button>
                    <button
                      onClick={() => declineFriendRequest(request.requester.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded-full text-sm hover:bg-red-600 flex items-center"
                    >
                      <UserX className="w-4 h-4 mr-1" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Friends List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
            <Users className="w-5 h-5 mr-2" />
            Friends ({friends.length})
          </h2>
          <div className="space-y-3">
            {friends.length === 0 ? (
              <p className="text-gray-500 text-center py-4">No friends yet. Start by adding some!</p>
            ) : (
              friends.map(friend => (
                <div key={friend.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-orange-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{friend.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{friend.username}</p>
                      <p className="text-sm text-gray-500">{friend.display_name}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Following List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white flex items-center">
            <Heart className="w-5 h-5 mr-2" />
            Following ({following.length})
          </h2>
          <div className="space-y-3">
            {following.length === 0 ? (
              <p className="text-gray-500 text-center py-4">Not following anyone yet.</p>
            ) : (
              following.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{user.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.display_name}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => unfollowUser(user.id)}
                    className="px-3 py-1 bg-gray-200 text-gray-800 rounded-full text-sm hover:bg-gray-300"
                  >
                    Unfollow
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Suggested Friends</h2>
            <div className="space-y-3">
              {suggestions.map(user => (
                <div key={user.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-red-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-semibold">{user.username.charAt(0).toUpperCase()}</span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{user.username}</p>
                      <p className="text-sm text-gray-500">{user.mutual_friends_count} mutual friends</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => sendFriendRequest(user.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600"
                    >
                      Add Friend
                    </button>
                    <button
                      onClick={() => followUser(user.id)}
                      className="px-3 py-1 bg-purple-500 text-white rounded-full text-sm hover:bg-purple-600"
                    >
                      Follow
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 
