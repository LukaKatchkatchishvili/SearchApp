export interface Data {
  id: string;
  alt_description: string;
  urls: {
    small: string;
    full: string;
  };
  likes: number;
  tags?: {
    title: string;
  }[];
}

export interface FetchConfig {
  searchTerm?: string;
  page: number;
  clientId: string;
}

export interface ModalProps {
  imageUrl: string;
  title: string;
  likes: number;
  onClose: () => void;
}
