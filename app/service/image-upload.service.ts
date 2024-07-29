import { Injectable } from '@angular/core';

import { Camera, CameraOptions } from '@ionic-native/camera/ngx';
import { FileTransfer, FileTransferObject, FileUploadOptions } from '@ionic-native/file-transfer/ngx';
import { Crop } from '@ionic-native/crop/ngx';

import { appConfig } from 'src/config';
import { AlertService } from './alert.service';

import { AuthenticationService } from './authentication.service';
import { LogsService } from './logs.service';
import { UserService } from './user.service';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: 'root'
})
export class ImageUploadService {

  private photoMessageOptions: CameraOptions = {
    quality: 90,
    destinationType: this.camera.DestinationType.FILE_URI,
    encodingType: this.camera.EncodingType.JPEG,
    correctOrientation: true,
    allowEdit: false,
    targetWidth: 1242,
    targetHeight: 1242
  };

  constructor(
    public crop: Crop,
    public auth: AuthenticationService,
    public camera: Camera,
    public transfer: FileTransfer,
    public userS: UserService,
    public alertS: AlertService,
    public logS: LogsService,
    public loadingS: LoadingService
  ) { 
  }

  uploadProfile(sourceType: string): Promise<any> {
    return new Promise(resolve => {
      if (sourceType == 'photo') {
        this.photoMessageOptions.sourceType = this.camera.PictureSourceType.SAVEDPHOTOALBUM;
			} else if (sourceType == 'camera') {
        this.photoMessageOptions.sourceType = this.camera.PictureSourceType.CAMERA;
      }
      
      this.camera.getPicture(this.photoMessageOptions).then((imageData) => {
        // 사진 크롭 설정
        this.crop.crop(imageData, 
          { 
            quality: 100
          }
        ).then(newImage => {

          this.loadingS.show(5000);
          this.backendUpload(newImage).then(res => {
            let obj = JSON.parse(res.response);
  
            if (obj.total == 1) {
              this.userS.putUserUpdate('thumbnail', { thumbnail: obj.name });
            }
            this.userS.putUserUpdate('insert-pictures', obj);
            resolve(obj);
            this.loadingS.hide();
          }).catch(e => {
            this.loadingS.hide();

            this.logS.errors({
              f_1: 'uploadProfile',
              f_2: 'backendUpload-catch',
              f_5: 'ionic',
              body: e
            });
            
            let obj = JSON.parse(e.body);
            this.alertS.alert('에러', obj.message);
            resolve(false);
          });

        }, e => {
          resolve(false);
        });
        
      }, (e) => {
        resolve(false);
      });

    });
  }

  backendUpload(base64Image: any) {
    const fileTransfer: FileTransferObject = this.transfer.create();

    let options: FileUploadOptions = {
      fileKey: 'filedata',
      chunkedMode: false,
      fileName: 'image.jpg',
      mimeType: 'image/jpeg',
      httpMethod: 'POST'
    }

    return fileTransfer.upload(base64Image, `${appConfig.teeshotConfig.webUrl}/pictures?token=`+ this.auth.isToken(), options);
  }

  uploadPhotoMessage(sourceType: string, thread_id: Number): Promise<any> {
    return new Promise(resolve => {

      this.getPicture(sourceType).then(imageData => {
        // let base64Image = 'data:image/jpeg;base64,' + imageData;
        // 사진 크롭 설정
        this.crop.crop(imageData, 
          { 
            quality: 100
          }
        ).then(newImage => {
          const fileTransfer: FileTransferObject = this.transfer.create();

          let options: FileUploadOptions = {
            fileKey: 'filedata',
            chunkedMode: false,
            fileName: 'image.jpg',
            mimeType: 'image/jpeg',
            httpMethod: 'POST'
          }

          this.loadingS.show(5000);
          fileTransfer.upload(newImage, `${appConfig.teeshotConfig.webUrl}/picturesmsg?token=`+ this.auth.isToken() + `&thread_id=` + thread_id, options)
            .then(res => {
              
              let data = JSON.parse(res.response);

              if (data.success) {
                resolve(data.name);
              }
              this.loadingS.hide();
            }).catch(e => {
              this.loadingS.hide();

              let obj = JSON.parse(e.body);
              this.alertS.alert('에러', obj.message);
              resolve(false);

              this.logS.errors({
                f_1: 'uploadPhotoMessage',
                f_2: 'backendUpload-catch',
                f_5: 'ionic',
                body: e
              });
            });
        }, e => {
          resolve(false);
        });

      }).catch(e => {
        resolve(false);
      });

    });
  }

  getPicture(sourceType: string) {
    if (sourceType == 'photo') {
      this.photoMessageOptions.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
    } else if (sourceType == 'camera') {
      this.photoMessageOptions.sourceType = this.camera.PictureSourceType.CAMERA;
    }

    return this.camera.getPicture(this.photoMessageOptions);
  }

}
