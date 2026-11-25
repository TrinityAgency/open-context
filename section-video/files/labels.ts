export type VideoLabels = {
  /** The play control behind a consent gate (an icon, named by this): it opens the consent settings. */
  play: string;
  /** The play control without a gate, and the link under the cover: both open the video's own page. */
  watch: string;
  /** The notice under the cover until the visitor allows external media. */
  notice: string;
};

export const VIDEO_LABELS: VideoLabels = {
  play: 'Play the video (allows external media)',
  watch: 'Watch the video',
  notice: 'The video is loaded from another provider once you allow external media.',
};
