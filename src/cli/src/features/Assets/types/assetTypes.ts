export type SingleAssetType = 'font' | 'image' | 'pdf' | 'video'

export type FontAsset = {
    fontName: string,
    fontSrc: string,
    fontUUID: string,
    fontDeletable: boolean
}

export type ImageAsset = {
    imageName: string,
    imageSrc: string,
    imageUUID: string,
    imageDeletable: boolean
}

export type PdfAsset = {
    pdfName: string,
    pdfSrc: string,
    pdfUUID: string,
    pdfDeletable: boolean
}

export type VideoAsset = {
    videoName: string,
    videoSrc: string,
    videoUUID: string,
    videoDeletable: boolean
}

export interface AssetData {
    fonts: FontAsset[],
    images: ImageAsset[],
    pdfs: PdfAsset[],
    videos: VideoAsset[]
}

export interface NewAssetOptions {
    assetType?: SingleAssetType;
    assetName?: string;
    assetSrc?: string;
    skipPrompts?: boolean;
}

export interface EditAssetOptions {
    assetUUID?: string;
    assetSrc?: string;
    skipPrompts?: boolean;
}

export interface DeleteAssetOptions {
    assetUUID?: string;
    skipPrompts?: boolean;
}