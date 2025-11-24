import {type SchemaTypeDefinition} from 'sanity'
import {media} from './media'
import {layout} from './layout'
import {category} from './category'
import {siteSettings} from './siteSettings'
import {textFile} from './textFile'
import {activityDismissal} from './activityDismissal'
import user from './user'

export const schema: {types: SchemaTypeDefinition[]} = {
  types: [media, layout, category, textFile, siteSettings, activityDismissal, user],
}
