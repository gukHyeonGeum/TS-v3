import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SocialNamePipe } from '../social-name.pipe';
import { ChangeStarPipe } from '../change-star.pipe';
import { AgePipe } from '../age.pipe';
import { GenderPipe } from '../gender.pipe';
import { AreaPipe } from '../area.pipe';
import { ScorePipe } from '../score.pipe';
import { YearPipe } from '../year.pipe';
import { FrequencyPipe } from '../frequency.pipe';
import { OverseaPipe } from '../oversea.pipe';
import { MembershipPipe } from '../membership.pipe';
import { BetweendayPipe } from '../betweenday.pipe';
import { FiltersPipe } from '../filters.pipe';
import { SponsorPipe } from '../sponsor.pipe';
import { POptionPipe } from '../p-option.pipe';
import { CommonPipe } from '../common.pipe';

@NgModule({
  declarations: [
    SocialNamePipe,
    ChangeStarPipe,
    AgePipe,
    GenderPipe,
    AreaPipe,
    ScorePipe,
    YearPipe,
    FrequencyPipe,
    OverseaPipe,
    MembershipPipe,
    BetweendayPipe,
    FiltersPipe,
    SponsorPipe,
    POptionPipe,
    CommonPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    SocialNamePipe,
    ChangeStarPipe,
    AgePipe,
    GenderPipe,
    AreaPipe,
    ScorePipe,
    YearPipe,
    FrequencyPipe,
    OverseaPipe,
    MembershipPipe,
    BetweendayPipe,
    FiltersPipe,
    SponsorPipe,
    POptionPipe,
    CommonPipe
  ]
})
export class PipesModule { }
