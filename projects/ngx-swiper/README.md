# Angular Swiper

This library is a general-purpose, lightweight and dependency-free swiper to be used in Angular applications.  
By default, you can pass an array of images url to the `items` property to have a fully working images swiper. To improve the performances, the swiper uses the `OnPush` change detection strategy and the images are lazy loaded.

If this behavior, or the usage of images, does not suit your needs, you can pass any kind of item to the `items` property and customize the slides with a `ng-template` passed to the `slideTemplate` property.

## Installation

```shell
$ npm install --save @tmfs/ngx-swiper
```

Or, if you're using [Yarn](https://yarnpkg.com/)

```shell
$ yarn add @tmfs/ngx-swiper
```

Then add the module `NgxSwiperModule` to your application.

## Usage

```html
<ngx-swiper
  [items]="items"
  [navigation]="false"
  [pagination]="false"
  [infinite]="true"
  [loop]="5000"
  [slideTemplate]="slideTemplate"
  [navigationButtonTemplate]="navigationTemplate"
  [paginationTemplate]="paginationTemplate"
  [transitionDuration]="400"
  [threshold]="30"
>
</ngx-swiper>

<ng-template #slideTemplate let-item>
  <!-- YOUR CUSTOM SLIDE -->
</ng-template>

<ng-template #navigationTemplate>
  <!-- YOUR CUSTOM NAVIGATION BUTTON -->
</ng-template>

<ng-template #paginationTemplate>
  <!-- YOUR CUSTOM PAGINATION -->
</ng-template>
```

| Property                 | Default    | Description                                                             |
| ------------------------ | ---------- | ----------------------------------------------------------------------- |
| items                    | _required_ | The array of items to display in the swiper                             |
| navigation               | false      | Whether to display the navigation arrows                                |
| pagination               | false      | Whether to display the pagination dots                                  |
| infinite                 | true       | Allow to navigate between slides indefinitely                           |
| loop                     | undefined  | The number of milliseconds a slide stays before sliding to the next one |
| slideTemplate            | undefined  | A custom template to replace the default slide template                 |
| navigationButtonTemplate | undefined  | A custom template for the navigation button                             |
| paginationTemplate       | undefined  | A custom template for the pagination at the bottom of the swiper        |
| transitionDuration       | 400        | The time in milliseconds for the Swiper transitions                     |
| threshold                | 30         | The number of px that must be swiped before going to next/prev slide    |
