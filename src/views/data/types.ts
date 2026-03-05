export interface Album {
  id: string
  title: string
  slug: string
  artist: string
  type: string
  releaseDate: string
  label: string
  coverImage: string
  description: string
  tracks: Track[]
  awards: string[]
  production: Production
}

export interface Track {
  id: string
  title: string
  lyricist: string
  composer: string
  arranger: string
  duration: string
  description: string
  vocalProducer?: string
  backingVocal?: string
  harmony?: string
  masteringProducer?: string
  audioPath: string
  qqMusicSongId: string
  neteaseMusicId: string
}

export interface Production {
  producers: string[]
  musicians: string[]
}

export interface Concert {
  date: string
  title: string
  places: string
  content: ConcertContent[]
}

export interface ConcertContent {
  type: string
  title?: string
  title_align?: string
  title_margin?: string
  background_image?: string
  content?: string
  button_link?: string
  image_url?: string
  picture?: string
  picture_title?: string
  city?: string
  subtitle?: string
  paragraphs?: string[]
  contentList?: SongTab[]
  index?: number
}

export interface SongTab {
  tab: string
  song: string[]
}

export interface Team {
  name: string
  background: string[]
  members: Member[]
}

export interface Member {
  id: number
  name: string
  role: string
  image: string
  description: string
  link: string
}

export interface VarietyShow {
  date: string
  title: string
  description: string
  places: string
  links: ShowLink[]
}

export interface ShowLink {
  subtitle: string
  links: LinkDetail[]
}

export interface LinkDetail {
  link_title: string
  link: string
  icon: string
  metadata: LinkMetadata
}

export interface LinkMetadata {
  video_date?: string
  date?: string
  songs?: string
  desc?: string
}

export interface ApiResponse<T> {
  code: number
  message: string
  data: T
}
