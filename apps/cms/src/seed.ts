import { getPayload } from 'payload'
import config from './payload.config.js'

/**
 * One-off seed for the "Neural Field" design's demo content. Populates every
 * global/collection with the exact copy from ~/payload-migration/Portfolio
 * Desktop.dc.html so demo.tusharjaryal.in has real content immediately.
 * Run with: npx tsx src/seed.ts
 */

function richText(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      format: '' as const,
      indent: 0,
      version: 1,
      direction: 'ltr' as const,
      children: paragraphs.map((text) => ({
        type: 'paragraph',
        format: '' as const,
        indent: 0,
        version: 1,
        direction: 'ltr' as const,
        children: [
          { type: 'text', format: 0, style: '', mode: 'normal', text, version: 1, detail: 0 },
        ],
      })),
    },
  }
}

async function run() {
  const payload = await getPayload({ config })

  payload.logger.info('Clearing existing projects/posts...')
  await payload.delete({ collection: 'projects', where: {} })
  await payload.delete({ collection: 'posts', where: {} })

  payload.logger.info('Creating projects...')
  const mspfNet = await payload.create({
    collection: 'projects',
    data: {
      name: 'MSPF-Net — fault diagnosis for high-speed train running gears',
      number: '01',
      order: 1,
      year: '2024–2026',
      category: 'ml infra',
      tags: ['PYTORCH', 'CUDA', "MASTER'S THESIS"],
      featured: true,
      summary:
        'A multi-scale periodicity-fused network for predictive maintenance of rotating machinery. Period decomposition splits the raw vibration signal by its dominant cycles; multi-scale convolutions extract fault features across resolutions; a fusion head makes the call.',
      highlightRows: [
        {
          label: 'DATA',
          value:
            '8 industrial vibration datasets, ~533K windows, automated preprocessing & condition-based splits',
        },
        { label: 'BASELINES', value: 'TimesNet · MixNet · Informer · ResNet1D · Transformer1D + 4 more' },
        { label: 'RIG', value: 'GPU training on self-managed Linux boxes — the infra below' },
      ],
      intro:
        "MSPF-Net is a multi-scale periodicity-fused network built for predictive maintenance of rotating machinery — specifically the running gears of high-speed trains. It's the core of my Master's thesis at National Chung Cheng University.",
      role: 'Research & sole developer',
      status: 'Thesis in progress · 2024–2026',
      stack: ['PyTorch', 'CUDA', 'Python', 'Linux', '8 industrial datasets'],
      stats: [
        { value: '533K', label: 'vibration windows' },
        { value: '8', label: 'datasets' },
        { value: '9', label: 'baselines beaten' },
      ],
      problem: richText([
        "Rotating machinery like high-speed train running gears fails gradually, not suddenly — but most fault-diagnosis models treat vibration signals as flat time series and miss the layered periodic structure that actually carries the fault signature.",
        'Existing baselines — TimesNet, Informer, ResNet1D and others — either ignore periodicity entirely or fuse it too early, losing resolution across different time scales.',
      ]),
      approach: richText([
        'MSPF-Net decomposes the raw vibration signal by its dominant periods first, then runs multi-scale convolutions across each decomposed stream to extract fault features at different resolutions.',
        'A fusion head combines these multi-scale features into a single fault classification, trained end-to-end on GPU across 8 industrial datasets with condition-based splits to avoid data leakage.',
      ]),
      outcome: richText([
        'Benchmarked head-to-head against 9 published architectures — including TimesNet, MixNet, Informer, ResNet1D and Transformer1D — MSPF-Net outperformed every baseline on the combined dataset.',
        'The training and evaluation pipeline runs entirely on self-managed Linux infrastructure, not a managed ML platform.',
      ]),
      testimonial: {
        quote:
          "Tushar built and ran our lab's entire training infrastructure himself — then beat every baseline on it.",
        attribution: 'Thesis advisor, CCU',
      },
    } as any,
  })

  const k8sPlatform = await payload.create({
    collection: 'projects',
    data: {
      name: 'A Kubernetes platform I run end-to-end',
      number: '02',
      order: 2,
      year: '2022–now',
      category: 'mlops',
      tags: ['KUBERNETES', 'RAW MANIFESTS', 'SELF-HOSTED'],
      featured: true,
      summary:
        'Production cluster on bare VPS metal — Nextcloud, MariaDB, Redis, background CronJobs, ingress-nginx with cert-manager TLS. Deployments, backups and monitoring automated in Bash and Python. Zero managed services, since 2022.',
      highlightRows: [
        { label: 'STACK', value: 'Ubuntu / Debian / RHEL · Docker · Git-driven deploys' },
        { label: 'SECURITY', value: 'hardened SSH, DNS, SSL/TLS, firewalls, monitoring' },
        { label: 'NEXT', value: "this site's CMS (Payload) moves onto the same cluster" },
      ],
      intro:
        'A production Kubernetes cluster I designed, deployed and have run solo since 2022 — serving Nextcloud, MariaDB, Redis and scheduled background jobs entirely from raw manifests, with zero managed cloud services.',
      role: 'Infrastructure engineer & operator',
      status: 'In production · 2022–now',
      stack: ['Kubernetes', 'Docker', 'Nginx', 'cert-manager', 'MariaDB', 'Redis', 'Bash', 'Python'],
      stats: [
        { value: '4+ yrs', label: 'in production' },
        { value: '0', label: 'managed services' },
        { value: '24/7', label: 'self-monitored' },
      ],
      problem: richText([
        "Running real infrastructure on rented VPS hardware means there's no managed control plane, no managed database, and no vendor support line — every failure mode is yours to catch.",
        'Off-the-shelf PaaS platforms hide exactly the operational knowledge — ingress routing, TLS renewal, backup integrity — that this project was meant to build.',
      ]),
      approach: richText([
        'The cluster is defined entirely in raw Kubernetes manifests rather than a higher-level abstraction, so every Deployment, Service, Ingress and CronJob is explicit and version-controlled.',
        'ingress-nginx handles routing with cert-manager automating TLS renewal; MariaDB and Redis run as stateful workloads with PVC-backed storage; Bash and Python scripts handle backups, monitoring and deploys.',
      ]),
      outcome: richText([
        "The cluster has been in continuous production since 2022, hosting Nextcloud and this portfolio's own CMS, with automated backups and zero reliance on managed cloud services.",
        "This same infrastructure is what MSPF-Net's GPU training pipeline runs on.",
      ]),
      testimonial: {
        quote: 'Rare combination: he understands the failure physics, the model, and the cluster it trains on.',
        attribution: 'Research supervisor',
      },
    } as any,
  })

  payload.logger.info('Creating posts...')
  const post1 = await payload.create({
    collection: 'posts',
    data: {
      title: 'Why periodicity is the signal your fault-diagnosis model is missing',
      date: '2026-08-01',
      kicker: 'DRAFT · RESEARCH',
      tags: ['research'],
    } as any,
  })
  const post2 = await payload.create({
    collection: 'posts',
    data: {
      title: 'Nextcloud on raw Kubernetes manifests: what nobody tells you',
      date: '2026-07-20',
      kicker: 'DRAFT · INFRA',
      tags: ['infra'],
    } as any,
  })
  const post3 = await payload.create({
    collection: 'posts',
    data: {
      title: "Leaving Sanity: self-hosting this site's CMS on my own cluster",
      date: '2026-07-05',
      kicker: 'DRAFT · META',
      tags: ['meta'],
    } as any,
  })

  payload.logger.info('Updating homePage...')
  await payload.updateGlobal({
    slug: 'homePage',
    data: {
      name: 'Tushar Jaryal',
      eyebrowLabel: 'TUSHAR JARYAL · INDUSTRIAL AI × INFRASTRUCTURE · CHIAYI, TW',
      heading: 'AI that listens to machines.\nInfrastructure that never blinks.',
      subtext:
        'Deep learning for fault diagnosis of industrial machinery — trained and served on Linux infrastructure I build and run myself.',
      ctaButtons: [
        { label: 'View work', href: '#work', primary: true },
        { label: 'Read research', href: '#research', primary: false },
      ],
      stats: [
        { value: '533K', label: 'vibration signal windows processed' },
        { value: '8', label: 'industrial datasets, one pipeline' },
        { value: '9', label: 'architectures benchmarked on GPU' },
        { value: '4+ yrs', label: 'Linux in production, self-hosted' },
      ],
      featuredProjects: [mspfNet.id, k8sPlatform.id],
      featuredPosts: [post1.id, post2.id, post3.id],
    },
  })

  payload.logger.info('Updating aboutPage...')
  await payload.updateGlobal({
    slug: 'aboutPage',
    data: {
      eyebrow: 'ABOUT',
      bio: richText([
        "I'm a Master's researcher in Smart Manufacturing at National Chung Cheng University, Taiwan — building deep learning models that hear machine faults before they happen. Since 2022 I've also run my own production Linux infrastructure: Kubernetes, GPU training rigs, and everything in between.",
        'Two disciplines, one loop: research gives the models, infrastructure keeps them running. Nothing here is a managed service.',
      ]) as any,
      metaLines: [
        { key: 'BASE', value: 'Chiayi, Taiwan' },
        { key: 'NOW', value: "MSc Smart Manufacturing, CCU '26" },
        { key: 'BEFORE', value: 'MCA 9.50 · BCA 9.46, Chitkara' },
        { key: 'SPEAKS', value: 'EN · HI · 中文 (basic)' },
        { key: 'ALSO', value: 'President, CCU Indian Assoc.' },
      ],
      skillGroups: [
        {
          label: 'AI & RESEARCH',
          items: ['PyTorch · CUDA', 'Time-series signal analysis', 'Predictive maintenance', 'Multimodal & federated DL'],
        },
        {
          label: 'AUTOMATION',
          items: ['Python · Bash · Shell', 'FastAPI · REST APIs', 'CI/CD-style pipelines', 'Monitoring & backups'],
        },
        {
          label: 'PLATFORM',
          items: ['Kubernetes · Docker', 'Nginx · TLS · DNS · SSH', 'Ubuntu / Debian / RHEL', 'MariaDB · Redis'],
        },
      ],
      timeline: [
        {
          span: '2024 — 2026',
          role: 'Graduate researcher — MSc Smart Manufacturing, CCU Taiwan',
          note: 'MSPF-Net thesis · industrial deep learning · President, CCU Indian Association.',
        },
        {
          span: '2023 — 2024',
          role: 'Research intern ×2 — TEEP@AsiaPlus, CCU',
          note: 'Federated multimodal learning (2024) · smart-city sustainability ML (2023).',
        },
        {
          span: '2022 — now',
          role: 'Independent infrastructure & automation engineering',
          note: 'Self-managed Linux fleet, Kubernetes cluster, security & automation — alongside MCA (9.50 CGPA), Chitkara University.',
        },
        {
          span: '2019 — 2022',
          role: 'BCA, Chitkara University — 9.46 CGPA',
          note: '2nd prize, CSI Hackathon 2021 · IIT certifications in architecture, cloud, Java.',
        },
      ],
      achievements: [
        {
          kind: 'publication',
          title: 'MSPF-Net: multi-scale periodicity-fused fault diagnosis',
          description: "Master's thesis — predictive maintenance for high-speed train running gears.",
          meta: 'CCU',
          year: '2024–2026',
        },
        {
          kind: 'publication',
          title: 'Multimodal & federated learning on industrial gas sensors',
          description: 'Regression vs unimodal vs multimodal vs federated — performance analysis.',
          meta: 'TEEP@ASIAPLUS',
          year: '2024',
        },
        {
          kind: 'publication',
          title: 'ML for carbon-emission estimation in smart cities',
          description: 'Sustainability assessment on industrial datasets for city planning.',
          meta: 'TEEP@ASIAPLUS',
          year: '2023',
        },
        {
          kind: 'publication',
          title: 'Web dashboards for small-vendor data enrichment',
          description: 'Presented at Chitkara University Doctoral Consortium.',
          meta: 'CUDC',
          year: '2023',
        },
      ],
    },
  })

  payload.logger.info('Updating recommendationsPage...')
  await payload.updateGlobal({
    slug: 'recommendationsPage',
    data: { eyebrow: 'RECOMMENDATIONS' },
  })

  payload.logger.info('Creating placeholder recommendations...')
  await payload.delete({ collection: 'recommendations', where: {} })
  await payload.create({
    collection: 'recommendations',
    data: {
      quote:
        "Tushar built and ran our lab's entire training infrastructure himself — then beat every baseline on it.",
      guestName: 'PLACEHOLDER',
      guestRole: 'THESIS ADVISOR, CCU',
      status: 'approved',
    },
  })
  await payload.create({
    collection: 'recommendations',
    data: {
      quote: 'Rare combination: he understands the failure physics, the model, and the cluster it trains on.',
      guestName: 'PLACEHOLDER',
      guestRole: 'RESEARCH SUPERVISOR',
      status: 'approved',
    },
  })

  payload.logger.info('Updating contactPage...')
  await payload.updateGlobal({
    slug: 'contactPage',
    data: {
      eyebrow: 'CONTACT',
      heading: "Let's build something that runs.",
      directLinks: [
        { label: 'EMAIL', value: 'tushar@tusharjaryal.in', href: 'mailto:tushar@tusharjaryal.in' },
        { label: 'GITHUB', href: 'https://github.com/Tushar-Jaryal' },
        { label: 'LINKEDIN', href: '#contact' },
        { label: 'RSS', href: '/blog' },
      ],
    },
  })

  payload.logger.info('Updating projectsPage...')
  await payload.updateGlobal({
    slug: 'projectsPage',
    data: {
      eyebrow: 'PROJECTS',
      heading: 'Selected work',
      intro: 'Case studies from the research and infrastructure work above — full write-ups, not just the teaser.',
    },
  })

  payload.logger.info('Updating blogPage...')
  await payload.updateGlobal({
    slug: 'blogPage',
    data: {
      eyebrow: 'BLOG',
      heading: 'From the blog',
    },
  })

  payload.logger.info('Updating siteSettings...')
  await payload.updateGlobal({
    slug: 'siteSettings',
    data: {
      brandName: 'tj',
      brandSuffix: '·',
      navItems: [
        { label: 'Work', href: '#work' },
        { label: 'Research', href: '#research' },
        { label: 'Skills', href: '#skills' },
        { label: 'Timeline', href: '#timeline' },
        { label: 'Blog', href: '#blog' },
      ],
      footerLine: 'CHIAYI, TAIWAN · SELF-HOSTED',
      copyright: '© 2026 TUSHAR JARYAL',
      seo: {
        title: 'Tushar Jaryal — Industrial AI × Infrastructure',
        description:
          'Deep learning for fault diagnosis of industrial machinery — trained and served on Linux infrastructure built and run by Tushar Jaryal.',
      },
    },
  })

  payload.logger.info('Seed complete.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
