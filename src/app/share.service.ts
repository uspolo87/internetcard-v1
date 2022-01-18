

import { Injectable } from '@angular/core';
import { Title, Meta } from '@angular/platform-browser';
import { MetaTag } from '../app/model/meta-tag'

@Injectable({
  providedIn: 'root'
})
export class ShareService {

  private urlMeta: string = "og:url";
  private titleMeta: string = "og:title";
  private descriptionMeta: string = "og:description";
  private imageMeta: string = "og:image";
  private secureImageMeta: string = "og:image:secure_url";

  private twitterTitle: string = "twitter:title"
  private twitterDesc: string = "twitter:description"
  private twitterImage: string = "twitter:image"
  private twitterUrl: string = "twitter:site"

  constructor(private metaService: Meta) { }

  public setFacebookTags(url: string, title: string, description: string): void {
    var imageUrl = `https://internetcard.in/assets/ecard-logo-blue-nav.svg`;
    var tags = [
      new MetaTag(this.urlMeta, url),
      new MetaTag(this.titleMeta, title),
      new MetaTag(this.descriptionMeta, description),
      new MetaTag(this.imageMeta, imageUrl),
      new MetaTag(this.secureImageMeta, imageUrl)
    ];
    this.setTags(tags);
  }

  public setTwitter(url: string, title: string, description: string): void {
    var imageUrl = `https://internetcard.in/assets/ecard-logo-blue-nav.svg`;
    var tags = [
      new MetaTag(this.twitterTitle, title),
      new MetaTag(this.twitterDesc, description),
      new MetaTag(this.twitterImage, imageUrl),
      new MetaTag(this.twitterUrl, url)
    ];
    this.setTags(tags);
  }

  private setTags(tags: MetaTag[]): void {
    tags.forEach(siteTag => {
      this.metaService.updateTag({ property: siteTag.name, content: siteTag.value });
    });
  }
}
