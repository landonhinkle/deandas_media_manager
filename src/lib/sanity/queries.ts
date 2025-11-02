// GROQ query strings for public pages

// All published categories with a media count
export const CATEGORIES_WITH_COUNTS = `
	*[_type == "category" && !(_id in path("drafts.**"))] | order(title asc) {
		_id,
		title,
		slug,
		"count": count(*[_type == "media" && !(_id in path("drafts.**")) && references(^._id)])
	}
`

// All published media, newest first
export const MEDIA_LIST = `
	*[_type == "media" && !(_id in path("drafts.**"))] | order(_createdAt desc) {
		_id,
		title,
		description,
		file {
			asset-> {
				_id,
				url,
				mimeType,
				originalFilename
			}
		},
		categories[]-> { _id, title, slug }
	}
`

// Single media by ID
export const MEDIA_BY_ID = `
	*[_type == "media" && _id == $id][0] {
		_id,
		title,
		description,
		file {
			asset-> {
				_id,
				url,
				mimeType,
				originalFilename
			}
		},
		categories[]-> { _id, title, slug }
	}
`

// Recent published media for home
export const RECENT_MEDIA = `
	*[_type == "media" && !(_id in path("drafts.**"))] | order(_createdAt desc) [0...6] {
		_id,
		title,
		description,
		file {
			asset-> {
				_id,
				url,
				mimeType
			}
		},
		categories[]-> { _id, title, slug }
	}
`

// Site settings (for About page copy)
export const SITE_SETTINGS = `
	*[_type == "siteSettings"][0] { title, description }
`
