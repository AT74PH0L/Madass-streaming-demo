import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, StrategyOptions } from 'passport-github2';
import { GitHubProfile } from './dto/github.profile.dto';

@Injectable()
export class GitHubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.GITHUB_CLIENT_ID || '',
      clientSecret: process.env.GITHUB_CLIENT_SECRET || '',
      callbackURL: process.env.GITHUB_CALLBACK_URL || '',
      scope: ['user:email'],
    } as StrategyOptions);
  }

  validate(accessToken: string, refreshToken: string, profile: GitHubProfile) {
    // console.log(profile);
    return profile;
  }
}
