Rails.application.routes.draw do
  # Authentication routes
  scope '/auth' do
    post '/signup', to: 'auth#signup'
    post '/login', to: 'auth#login'
    post '/verify_email', to: 'auth#verify_email'
    post '/resend_verification', to: 'auth#resend_verification'
    post '/forgot_password', to: 'auth#forgot_password'
    post '/reset_password', to: 'auth#reset_password'
    get '/me', to: 'auth#me'
  end
  
  # Social features routes
  scope '/social' do
    get '/followers', to: 'social#followers'
    get '/followers/:user_id', to: 'social#followers'
    get '/following', to: 'social#following'
    get '/following/:user_id', to: 'social#following'
    get '/friends', to: 'social#friends'
    get '/friends/:user_id', to: 'social#friends'
    get '/friend_requests', to: 'social#friend_requests'
    get '/search_users', to: 'social#search_users'
    get '/suggestions', to: 'social#suggestions'
    
    post '/follow/:id', to: 'social#follow'
    delete '/unfollow/:id', to: 'social#unfollow'
    post '/friend_request/:id', to: 'social#send_friend_request'
    post '/accept_friend_request/:id', to: 'social#accept_friend_request'
    post '/decline_friend_request/:id', to: 'social#decline_friend_request'
    delete '/remove_friend/:id', to: 'social#remove_friend'
  end
  
  # Community features
  resources :posts, only: [:index, :show, :create, :update, :destroy] do
    resources :comments, only: [:index, :create]
    resources :likes, only: [:create, :destroy]
  end
  resources :comments, only: [:show, :update, :destroy]
  get 'feed', to: 'posts#feed'
  get 'feed/friends', to: 'posts#friends_feed'
  get 'feed/following', to: 'posts#following_feed'
  
  # Core models
  resources :users, only: [:index, :show, :create, :update, :destroy]
  resources :projects, only: [:index, :show, :create, :update, :destroy]
  resources :tasks, only: [:index, :show, :create, :update, :destroy]
  resources :resources, only: [:index, :show, :create, :update, :destroy]
  resources :tags, only: [:index, :show, :create, :update, :destroy]

  # Join models
  resources :user_projects, only: [:index, :show, :create, :update, :destroy]
  resources :user_tasks, only: [:index, :show, :create, :update, :destroy]
  resources :user_resources, only: [:index, :show, :create, :update, :destroy]

  resources :project_tasks, only: [:index, :show, :create, :update, :destroy]
  resources :project_resources, only: [:index, :show, :create, :update, :destroy]
  resources :project_tags, only: [:index, :show, :create, :update, :destroy]

  resources :task_resources, only: [:index, :show, :create, :update, :destroy]
  resources :task_tags, only: [:index, :show, :create, :update, :destroy]
  resources :resource_tags, only: [:index, :show, :create, :update, :destroy]
end
