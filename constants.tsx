import { Project, ArtWork, Photography } from './types';

export const ART_WORKS: ArtWork[] = [
  {
    id: 'art-1',
    title: 'Nature Aging: A DNA-Methylation Clock for Intrinsic Capacity',
    client: 'Furman Lab',
    image: 'Covers/NatAging_Cover.png'
  },
  {
    id: 'art-2',
    title: 'Amyloid-β-driven Alzheimer\'s disease reshapes the colonic immune system in mice',
    client: 'Winer Lab',
    image: 'Covers/Final_Cover_Submission-02.png'
  },
  {
    id: 'art-3',
    title: 'Multi-Omics Analysis Reveals Biomarkers That Contribute to Biological Age Rejuvenation in Response to Single-Blinded Randomized Placebo-Controlled Therapeutic Plasma Exchange',
    client: 'Furman Lab',
    image: 'Covers/TPE_Cover.png'
  }
];

// 1. VITE GLOB: Look in the actual file system path
const imageModules = import.meta.glob('./public/Photography/*.{png,jpg,jpeg,SVG}', { 
  eager: true, 
  query: 'url' 
});

const formatFileName = (path: string) => {
  return path
    .split('/')
    .pop()
    ?.split('.')[0]
    .replace(/[_-]/g, ' ')
    .replace(/\b\w/g, (l) => l.toUpperCase()) || 'Untitled';
};


export const PROJECTS: Project[] = [
  {
    id: 'pub-1',
    title: 'Amyloid-β-driven Alzheimer\'s disease reshapes the colonic immune system in mice',
    description: 'Developed bioinformatics pipelines to process 16S microbiome sequencing data.',
    tags: ['Aging', 'Microbiome', 'R'],
    image: 'Covers/CellReportsAD.png', 
    link: 'https://doi.org/10.1016/j.celrep.2025.116109',
    type: 'Publication'
  },
  {
    id: 'pub-2',
    title: 'Spaceflight as a Model of Accelerated Aging',
    description: 'Review positioning spaceflight as a model for environment-driven aging',
    tags: ['Spaceflight', 'Aging', 'Systems Biology'],
    image: 'Covers/Manwaring_Mueller_Et_Al.jpg', 
    type: 'Publication'
  },
  {
    id: 'pub-3',
    title: 'Longitudinal Modeling of the Microbiome in Celiac Disease',
    description: 'Modeling gut microbiome development using CDGEMM Consortium data.',
    tags: ['Celiac Disease', 'Longitudinal Multi-omics', 'Autoimmunity'],
    image: 'Covers/CDGEMM COVER.jpg', 
    link: 'https://doi.org/10.1016/S0016-5085(25)01156-4',
    type: 'Project'
  },
  {
    id: 'pub-4',
    title: 'Immunological biomarkers of aging',
    description: 'Review evaluates evolution of immunological biomarkers and organoids.',
    tags: ['Organoids', 'Aging', 'Immunology'],
    image: 'Covers/ImmunologicalBiomarkers.png', 
    link: 'https://doi.org/10.1093/jimmun/vkae036',
    type: 'Publication'
  },
  {
    id: 'pub-5',
    title: 'Substrate Stiffness Dictates Unique Doxorubicin-induced Senescence-associated Secretory Phenotypes and Transcriptomic Signatures in Human Pulmonary Fibroblasts',
    description: 'Primary research finding substrate stiffness modulates senescent-cell secretory profile.',
    tags: ['Cell Culture', 'Aging', 'Senescence'],
    image: 'Covers/Substrate_Stiffness.jpg', 
    link: 'https://doi.org/10.1007/s11357-025-01507-x',
    type: 'Publication'
  }
];

// 2. AUTOMATED PHOTOGRAPHY EXPORT
export const PHOTOGRAPHY: Photography[] = Object.entries(imageModules).map(([path, url], index) => {
  // We need to make sure the URL doesn't have "/public" in it for the browser
  const browserUrl = (url as any).default || url;
  const cleanUrl = typeof browserUrl === 'string' 
    ? browserUrl.replace('/public', '') 
    : browserUrl;

  return {
    id: `photo-${index}`,
    title: formatFileName(path),
    location: 'Gallery',
    image: cleanUrl
  };
});

// constants.tsx
export const BIO = {
  name: "Max Manwaring Mueller",
  title: "MSTP Student, University of Utah",
  image: 'IMG_6704.jpeg', 
  visionText: `We are currently witnessing the convergence between two historically seperate fields: epidemiology and molecular biomedical sciences. This new frontier sits atop the framework of systems biology and is perhaps best known as precision medicine. For the first time, we have the power to take population-level data from across multiple systems or "omics"—genomics, proteomics, metabolomics—to understand the many levels at which complex biology operates, both under normal and diseased conditions.

  By marrying these fields, we may explore how environmental exposures and genetics interact to influence health at a population scale, while simultaneously revealing how an individual differs from or aligns with that population. This allows us to uncover deeply personal insights about health that were previously impossible to contextualize. I am motivated to study the genetic and environmental factors that contribute to autoimmune diseases with the hope of seeing earlier time-to-diagnoses and effective, personalized therapy. 
  
  My perspective on this is informed by my own journey through the healthcare system. While our medical system is capable of incredible things, it is no secret many find themselves lost in what can only be described as a "diagnostic odyssey", a journey which may unfold over years of visits, referals, and unknowns. This is not to say the current system is failing, but that there is ample room for growth in how we transition from managing symptoms to understanding the root causes of systemic failure.
  
  I view bioinformatics as the most effective toolset we have to quickly and effectively understand the complexities of chronic disease, and believe a new age of discovery will lift medicine to a height were no disease is too complicated, and no patient incurable. This plays out in several ways—from leveraging biobanks to refine our diagnostic timelines to using longitudinal modeling to predict disease flare-ups before they occur. I have detailed my specific thoughts on these methodologies and the future of the field on my Substack/Blog tab.`, 

  purposeText: `I have built this website because I believe that the progress of science and medicine depends on open communication and the shared use of resources. No discovery happens in a vacuum, and I want to collaborate with others to see these fields succeed. This space is a place for me to share my own thoughts as well as the work of others that I find particularly important, useful, or interesting.

You can explore my Publications for a look at my research, or visit the Artwork and Photography tabs to see how I use visual media as a storytelling device for science and the human system. I have also curated a list of tools and papers that have been instrumental to my own work in the Resources tab. I welcome collaborations and discussions at any time, and I look forward to connecting with anyone who shares a commitment to advancing the next wave of biomedical science.`
};
