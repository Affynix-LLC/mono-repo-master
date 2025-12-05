import { Workflow } from '../types';
import { v4 as uuidv4 } from 'uuid';

export function createSocialMediaWorkflow(): Workflow {
  return {
    id: uuidv4(),
    name: 'Social Media Post Generation',
    description: 'Fetch products → Generate posts → Post to social media',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    steps: [
      {
        id: 'fetch_products',
        name: 'Fetch New Products',
        type: 'tool',
        config: {
          tool: 'get_affynix_products',
          args: {
            limit: 5,
            sort: 'created_date',
            order: 'desc',
          },
        },
      },
      {
        id: 'generate_twitter',
        name: 'Generate Twitter Post',
        type: 'tool',
        config: {
          tool: 'generate_social_post',
          args: {
            product: '{{fetch_products.0}}',
            platform: 'twitter',
            tone: 'enthusiastic',
          },
        },
        dependsOn: ['fetch_products'],
      },
      {
        id: 'generate_facebook',
        name: 'Generate Facebook Post',
        type: 'tool',
        config: {
          tool: 'generate_social_post',
          args: {
            product: '{{fetch_products.0}}',
            platform: 'facebook',
            tone: 'informative',
          },
        },
        dependsOn: ['fetch_products'],
      },
      {
        id: 'post_twitter',
        name: 'Post to Twitter',
        type: 'tool',
        config: {
          tool: 'post_to_twitter',
          args: {
            content: '{{generate_twitter.post}}',
          },
        },
        dependsOn: ['generate_twitter'],
      },
      {
        id: 'post_facebook',
        name: 'Post to Facebook',
        type: 'tool',
        config: {
          tool: 'post_to_facebook',
          args: {
            content: '{{generate_facebook.post}}',
          },
        },
        dependsOn: ['generate_facebook'],
      },
    ],
  };
}

export function createDailySocialMediaWorkflow(): Workflow {
  return {
    id: uuidv4(),
    name: 'Daily Social Media Campaign',
    description: 'Generate and post 3 social media posts daily from new products',
    enabled: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    steps: [
      {
        id: 'fetch_new_products',
        name: 'Fetch New Products',
        type: 'tool',
        config: {
          tool: 'get_affynix_products',
          args: {
            limit: 3,
            sort: 'created_date',
            order: 'desc',
          },
        },
      },
      {
        id: 'generate_morning_post',
        name: 'Generate Morning Post',
        type: 'tool',
        config: {
          tool: 'generate_social_post',
          args: {
            product: '{{fetch_new_products.0}}',
            platform: 'twitter',
            tone: 'enthusiastic',
          },
        },
        dependsOn: ['fetch_new_products'],
      },
      {
        id: 'generate_afternoon_post',
        name: 'Generate Afternoon Post',
        type: 'tool',
        config: {
          tool: 'generate_social_post',
          args: {
            product: '{{fetch_new_products.1}}',
            platform: 'facebook',
            tone: 'informative',
          },
        },
        dependsOn: ['fetch_new_products'],
      },
      {
        id: 'generate_evening_post',
        name: 'Generate Evening Post',
        type: 'tool',
        config: {
          tool: 'generate_social_post',
          args: {
            product: '{{fetch_new_products.2}}',
            platform: 'linkedin',
            tone: 'professional',
          },
        },
        dependsOn: ['fetch_new_products'],
      },
    ],
  };
}

