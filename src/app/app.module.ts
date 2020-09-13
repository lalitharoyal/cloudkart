import { BrowserModule, HAMMER_GESTURE_CONFIG, HammerGestureConfig } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import * as ionicGalleryModal from 'ionic-gallery-modal';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { ChartsModule } from 'ng2-charts/charts/charts';
import { IonicStorageModule } from '@ionic/storage';
import { SocialSharing } from '@ionic-native/social-sharing';
import { MobileAccessibility } from '@ionic-native/mobile-accessibility';
import { ImagePicker } from '@ionic-native/image-picker';
//import { Crop } from '@ionic-native/crop';
import { UserInterestService } from '../providers/userInterest.service'; 
import { PeopleService } from '../providers/names.service';
import { HttpModule } from '@angular/http';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { LongPressModule } from 'ionic-long-press';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { MentionModule } from 'angular-mentions/mention';
import { MyApp } from './app.component';


import { ChatListPage } from '../pages/chatList/chatList';
import { SimpleGlobal } from 'ng2-simple-global';
import { LoginPage } from '../pages/login/login';
import { InvitecodePage } from '../pages/invitecode/invitecode';
import { SocialLoginPage } from '../pages/social_login/social_login';
import { TermsPage } from '../pages/terms/terms';
import { PrivacyPage } from '../pages/privacy/privacy';
import { AboutPage } from '../pages/about/about';
import { MessagesPage } from '../pages/messages/messages';
import { FeedbackPage } from '../pages/feedback/feedback';
import { InvitefriendsPage } from '../pages/invitefriends/invitefriends';
import { PopupCreatePage } from '../pages/popup-create/popup-create';
import { InvitePopupPage } from '../pages/invite-popup/invite-popup';
import { PopupTagsPage } from '../pages/popup-tags/popup-tags';
import { RepliesPage } from '../pages/replies/replies';
import { CommentPage } from '../pages/comment/comment';
import { PopupLocationPage } from '../pages/popup-location/popup-location';
import { BroadcastInvitePopupPage } from '../pages/broadcast-invite-popup/broadcast-invite-popup';
import { PopupMorePage } from '../pages/popup-comingsoon/popup-comingsoon';
import { PopupCrowdReachCountPage } from '../pages/popup-crowdReachCount/popup-crowdReachCount';
import { PopupAvatarPage } from '../pages/popup-avatar/popup-avatar';
import { PopupCrowdInfoPage } from '../pages/popup-crowdInfo/popup-crowdInfo';
import { PopupDeletePage } from '../pages/popup-delete/popup-delete';
import { TimelinePage } from '../pages/timeline/timeline';
import { SharepopupPage } from '../pages/share_popup/share_popup';

import { Onboarding_01Page } from '../pages/onboarding-01/onboarding-01';
import { Onboarding2Page } from '../pages/onboarding2/onboarding2';
import { Onboarding_03Page } from '../pages/onboarding-03/onboarding-03';
import { ProfilePage } from '../pages/profile/profile';
import { ZoneTimelinePage } from '../pages/zoneTimeline/zoneTimeline';

import { YourProfilePage } from '../pages/your_profile/your_profile';
import { ProfileUserPage } from '../pages/profile_user/profile_user';
import { CreateZonePage } from '../pages/create_zone/create_zone';
import { EditZonePage } from '../pages/edit_zone/edit_zone';

import { NotificationListPage } from '../pages/notificationList/notificationList';
import { InviteMembersPage } from '../pages/invite_members/invite_members';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Camera } from '@ionic-native/camera';
import { Network } from '@ionic-native/network';
import { AppMinimize } from '@ionic-native/app-minimize';
import { Firebase } from '@ionic-native/firebase';
import { GooglePlacesAutocompleteComponentModule } from 'ionic2-google-places-autocomplete';
import { PopupOptionsPage }from'../pages/popup-options/popup-options';
import { AddMembersPage }from'../pages/add-members/add-members';

import { TabsPage } from '../pages/tabs/tabs';
import { ZonesPage } from '../pages/zones/zones';
import { PeoplePage } from '../pages/people/people';
import { TagsPage } from '../pages/tags/tags';
import { PopupTextPage } from '../pages/popup-text/popup-text';
import { PopupAgePage } from '../pages/popup-age/popup-age';
import { JoinzonePopupPage } from '../pages/joinzone-popup/joinzone-popup';
import { EmailInvitationsPage } from '../pages/email_invitations/email_invitations';
import { TestPage } from '../pages/test/test';
import{ViewfollowersListPage}from '../pages/viewfollowers-list/viewfollowers-list';

@NgModule({
  declarations: [
    MyApp,EditZonePage, PeoplePage, TagsPage, EmailInvitationsPage, PopupTextPage, TestPage, LoginPage, AddMembersPage, 
    ChatListPage, InvitecodePage, SocialLoginPage, TermsPage, NotificationListPage, CreateZonePage, PopupLocationPage,
    InviteMembersPage, PrivacyPage, AboutPage,PopupOptionsPage, MessagesPage,PopupAgePage, JoinzonePopupPage,
    FeedbackPage, InvitefriendsPage, TimelinePage, CommentPage, PopupDeletePage, PopupCreatePage,   
    SharepopupPage, ProfilePage, ZoneTimelinePage, YourProfilePage, ProfileUserPage, Onboarding2Page,ViewfollowersListPage,   
    PopupMorePage, RepliesPage, PopupTagsPage, PopupCrowdReachCountPage, PopupCrowdInfoPage, PopupAvatarPage, TabsPage, ZonesPage,
    Onboarding_01Page, Onboarding_03Page, InvitePopupPage, BroadcastInvitePopupPage    
  ],
 imports: [
    BrowserModule,
    GooglePlacesAutocompleteComponentModule,
    ionicGalleryModal.GalleryModalModule, MentionModule,   
    IonicModule.forRoot(MyApp,{
            backButtonText: '',
            backButtonIcon: 'arrow-back',
            iconMode: 'md',
            scrollPadding: false,
            scrollAssist: true, 
            autoFocusAssist: true,
            platforms: {
              ios: {
                statusbarPadding: true                
              }
            },
            tabsHideOnSubPages: 'true'   
        }),
    ChartsModule,
     IonicStorageModule.forRoot(),
      HttpModule,
      LongPressModule      
    ],   
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,EditZonePage, PeoplePage, TagsPage, EmailInvitationsPage, PopupTextPage, TestPage, BroadcastInvitePopupPage, PopupAgePage, JoinzonePopupPage,
    LoginPage, AddMembersPage, ChatListPage, InvitecodePage, SocialLoginPage, TermsPage, NotificationListPage, CreateZonePage, PopupLocationPage,
    InviteMembersPage, PrivacyPage, AboutPage,PopupOptionsPage, MessagesPage, FeedbackPage, InvitefriendsPage, TimelinePage, CommentPage, PopupDeletePage, PopupCreatePage,   
    SharepopupPage, ProfilePage, ZoneTimelinePage, YourProfilePage, ProfileUserPage, Onboarding2Page, Onboarding_03Page,ViewfollowersListPage,   
    PopupMorePage, RepliesPage, PopupTagsPage, PopupCrowdReachCountPage, PopupCrowdInfoPage, PopupAvatarPage, TabsPage, ZonesPage, Onboarding_01Page, InvitePopupPage   
  ],
  providers: [
    StatusBar, SplashScreen,  Network, Camera, ImagePicker, MobileAccessibility, SocialSharing, InAppBrowser, SimpleGlobal, AppMinimize,   
    { provide: ErrorHandler, 
      useClass: IonicErrorHandler
    },
    {
      provide: HAMMER_GESTURE_CONFIG,
      useClass: ionicGalleryModal. GalleryModalHammerConfig,
    },      
    Facebook,GooglePlus,
    UserInterestService,PeopleService,Firebase
  ] 
})

export class AppModule {
}


