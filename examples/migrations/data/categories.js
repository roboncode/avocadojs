const categories = {
  music: {
    _key: 'music',
    label: 'Music',
    icon: 'technology',
    link: '/categories/music/',
    priority: 1,
    filters: [
      { label: 'thumb', type: 'string' },
      { label: 'Name', type: 'string' },
      { label: 'Artist', type: 'string' },
      { label: 'Album Artist', type: 'string' },
      { label: 'Album', type: 'string' },
      { label: 'Composer', type: 'string' },
      { label: 'Genre', type: 'string' },
      { label: 'Year', type: 'string' },
      { label: 'Explicit', type: 'boolean' }
    ]
  },
  books: {
    _key: 'books',
    label: 'Books',
    icon: 'book',
    link: '/categories/books/'
  },
  movies: {
    _key: 'movies',
    label: 'Movies',
    icon: 'cinema',
    link: '/categories/movies/'
  },
  outdoors: {
    _key: 'outdoors',
    label: 'Outdoors',
    icon: 'transport',
    link: '/categories/outdoors/'
  },
  travel: {
    _key: 'travel',
    label: 'Travel',
    icon: 'technology-1',
    link: '/categories/travel/'
  },
  activity: {
    _key: 'activity',
    label: 'Activity',
    icon: 'sports',
    link: '/categories/activity/'
  },
  food: {
    _key: 'food',
    label: 'Food',
    icon: 'drink',
    link: '/categories/food/'
  },
  fashion: {
    _key: 'fashion',
    label: 'Fashion',
    icon: 'fashion',
    link: '/categories/fashion/'
  },
  fitness: {
    _key: 'fitness',
    label: 'Fitness',
    icon: 'gym',
    link: '/categories/fitness/'
  },
  shopping: {
    _key: 'shopping',
    label: 'Shopping',
    icon: 'commerce',
    link: '/categories/shopping/'
  },
  beauty: {
    _key: 'beauty',
    label: 'Beauty',
    icon: 'fashion-1',
    link: '/categories/beauty/'
  },
  games: {
    _key: 'games',
    label: 'Games',
    icon: 'technology-2',
    link: '/categories/games/'
  },
  technology: {
    _key: 'technology',
    label: 'Technology',
    icon: 'computer',
    link: '/categories/tech/'
  },
  business: {
    _key: 'business',
    label: 'Business',
    icon: 'construction',
    link: '/categories/business/'
  },
  home_garden: {
    _key: 'home_garden',
    label: 'Home & Garden',
    icon: 'internet',
    link: '/categories/homegarden/'
  },
  medical: {
    _key: 'medical',
    label: 'Medical',
    icon: 'construction',
    link: '/categories/medical/'
  }
}

module.exports = categories
