import { Component, OnInit } from '@angular/core';
import { PostsService } from '../../services/posts.service';
import { ActivatedRoute } from '@angular/router';
import { AlertService } from 'src/app/services/alert.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { UsersService } from '../../services/users.service'
@Component({
  selector: 'app-posts-list',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css'],

})
export class PostsComponent implements OnInit {

  posts: any[] = [];
  totalPosts: number;
  commentForm: FormGroup;
  idFriend: number;
  info: any[] = [];
  user: any[] = [];
  postId: any[] = [];
  profileName: string;
  profileGravatar: string;
  profileFollowing: number;
  profileFollowers: number;
  profileId: number;
  checkFollow: boolean;
  newFollow: boolean;
  controlPage: number = 0;
  photoDetails: any[] = [];
  photoTags: any[];
  photoComments: any[];

  constructor(
    private route: ActivatedRoute,
    private postsService: PostsService,
    private formBuilder: FormBuilder,
    private alertService: AlertService,
    private modalService: NgbModal,
    private usersService: UsersService
  ) {
    this.route.params.subscribe(res => console.log(res.idFriend));
    this.route.params.subscribe(res => console.log(res.page));
  }

  ngOnInit() {
    this.getPostsMyFriend();
    this.verifyFollow();
    this.idFriend = this.route.snapshot.params['idFriend']
    this.commentForm = this.formBuilder.group({
      comments: ['',]
    });

  }

  get c() { return this.commentForm.controls; }

  getPostsMyFriend() {
    this.idFriend = this.route.snapshot.params['idFriend']
    this.postsService.getProfileFriend(this.route.snapshot.params['page'], this.idFriend)
      .subscribe(res => {
        this.info = res.info;
        this.user = res.user;
        this.totalPosts = res.totalPosts;
        this.profileName = this.user[0]['name'];
        this.profileGravatar = this.user[0]['gravatar_hash'];
        this.profileFollowing = this.user[0]['seguindoCount'];
        this.profileFollowers = this.user[0]['seguidoresCount'];

      });
  }

  loadMorePhotos() {
    this.idFriend = this.route.snapshot.params['idFriend']
    this.controlPage++;
    this.postsService.getProfileFriend(this.route.snapshot.params['page'] + this.controlPage, this.idFriend)
      .subscribe(res => {
        for (let photo of res.info) {
          this.info.push(photo);
        };

      })
  }

  getPhotoMyFriend(photoId: number) {
    this.postsService.getPhotoDetails(photoId)
      .subscribe(
        res => {
          this.photoDetails = res.photo
          this.photoTags = res.tags
          this.photoComments = res.comments
        });
  }

  // mesmas funções do profile (LIKE, DISLIKE, CREATECOMMENT) (tentar ajustar com @INPUT OUTPUT e SERVIÇOS)
  giveLike(photoId: number) {
    this.postsService.like(photoId)
      .subscribe(
        res => {
          console.log("Retorno LIKE BD")
          console.log(res)
        });
  }
  removeLike(photoId: number) {

    this.postsService.dislike(photoId)
      .subscribe(
        res => {
          console.log("Retorno DISLIKE BD")
          console.log(res)
        });
  }

  verifyFollow() {
    this.usersService.getCheckFollower(this.idFriend)
      .subscribe(
        res => {
          this.checkFollow = res.success
          console.log(this.checkFollow)
          console.log("Retorno checando se esta seguindo")
        });
  }

  follow() {
    this.usersService.getFollow(this.idFriend)
      .subscribe(
        res => {
          console.log("Retorno new seguidor")
          console.log(res)
        });
  }

  unfollow() {
    this.usersService.getUnFollow(this.idFriend)
      .subscribe(
        res => {
          console.log("Retorno new unfollow")
          console.log(res)
        });

  }
  createComment(photoId: number) {
    this.postsService.createComment(this.c.comments.value, photoId)
      .subscribe(
        res => {
          console.log("Retorno POSTCOMMENT BD")
          this.c.comments.setValue("");
          console.log(res)
        },
        error => {
          this.alertService.error(error);

          alert('connection error')
        });
  }

  deleteComment(idComment: number) {
    this.postsService.getDeleteComment(idComment)
      .subscribe(
        res => {
          console.log(res)
        });
  }

  /**modal scroll 2 */
  openModalPhoto(modalPhoto) {
    this.modalService.open(modalPhoto, { scrollable: true });
  }

}
