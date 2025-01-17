import { defineComponent, computed } from '@vue/composition-api';

import { usePrefixClass } from '../config-provider';
import useCommonClassName from '../hooks/useCommonClassName';
import { renderTNodeJSX, renderContent } from '../utils/render-tnode';

import TLoading from '../loading';
import props from './props';

export default defineComponent({
  name: 'TCard',
  props: { ...props },
  components: { TLoading },
  setup(props, { slots }) {
    const COMPONENT_NAME = usePrefixClass('card');
    const { sizeClassNames } = useCommonClassName();

    const baseCls = [`${COMPONENT_NAME.value}`];
    const headerCls = [`${COMPONENT_NAME.value}__header`];
    const headerAvatarCls = [`${COMPONENT_NAME.value}__avatar`];
    const headerTitleCls = [`${COMPONENT_NAME.value}__title`];
    const headerSubTitleCls = [`${COMPONENT_NAME.value}__subtitle`];
    const headerDescriptionCls = [`${COMPONENT_NAME.value}__description`];
    const actionsCls = [`${COMPONENT_NAME.value}__actions`];

    const bodyCls = [`${COMPONENT_NAME.value}__body`];
    const coverCls = [`${COMPONENT_NAME.value}__cover`];
    const footerCls = [`${COMPONENT_NAME.value}__footer`];

    if (props.size === 'small') baseCls.push(`${sizeClassNames[props.size]}`);

    if (props.bordered) baseCls.push(`${COMPONENT_NAME.value}--bordered`);

    if (props.shadow) baseCls.push(`${COMPONENT_NAME.value}--shadow`);

    if (props.hoverShadow) baseCls.push(`${COMPONENT_NAME.value}--shadow-hover`);

    if (props.headerBordered) headerCls.push(`${COMPONENT_NAME.value}__title--bordered`);

    // 卡片风格：普通风格、海报风格1（操作区域在顶部）、海报风格2（操作区域在底部）。
    // 可选项：normal/poster1/poster2
    const isPoster2 = computed(() => props.theme === 'poster2');

    const showTitle = computed(() => props.title || slots.title);
    const showHeader = computed(() => props.header || slots.header);
    const showSubtitle = computed(() => props.subtitle || slots.subtitle);
    const showAvatar = computed(() => props.avatar || slots.avatar);
    const showDescription = computed(() => props.description || slots.description);
    const showStatus = computed(() => props.status || slots.status);
    const showActions = computed(() => props.actions || slots.actions);
    const showFooter = computed(() => props.footer || slots.footer);
    const showCover = computed(() => props.cover || slots.cover);
    const showLoading = computed(() => props.loading || slots.loading);
    const showContent = computed(() => props.content || slots.content || props.default || slots.default);

    // 是否展示头部区域
    const isHeaderRender = computed(
      () => showHeader.value
        || showTitle.value
        || showSubtitle.value
        || showDescription.value
        || showAvatar.value
        || (showStatus.value && isPoster2.value)
        || (showActions.value && !isPoster2.value),
    );

    // 是否展示底部区域
    const isFooterRender = computed(() => showFooter.value || (showActions.value && isPoster2.value));

    return {
      isHeaderRender,
      isFooterRender,
      isPoster2,
      showLoading,
      showHeader,
      showTitle,
      showSubtitle,
      showDescription,
      showAvatar,
      showActions,
      showStatus,
      showContent,
      showCover,
      showFooter,
      baseCls,
      bodyCls,
      footerCls,
      coverCls,
      actionsCls,
      headerCls,
      headerAvatarCls,
      headerTitleCls,
      headerSubTitleCls,
      headerDescriptionCls,
      COMPONENT_NAME,
    };
  },
  methods: {
    renderLoading() {},
    // 封面区域渲染逻辑
    renderCover() {
      const textCover = typeof this.cover === 'string';
      return (
        <div class={this.coverCls}>{textCover ? <img src={this.cover}></img> : renderTNodeJSX(this, 'cover')}</div>
      );
    },
    // 头部区域渲染逻辑
    renderHeader() {
      if (this.showHeader) return <div class={this.headerCls}>{renderTNodeJSX(this, 'header')}</div>;
      return (
        <div class={this.headerCls}>
          <div class={`${this.COMPONENT_NAME}__header-wrapper`}>
            {this.showAvatar && <div class={this.headerAvatarCls}>{renderTNodeJSX(this, 'avatar')}</div>}
            <div>
              {this.showTitle && <span class={this.headerTitleCls}>{renderTNodeJSX(this, 'title')}</span>}
              {this.showSubtitle && <span class={this.headerSubTitleCls}>{renderTNodeJSX(this, 'subtitle')}</span>}
              {this.showDescription && <p class={this.headerDescriptionCls}>{renderTNodeJSX(this, 'description')}</p>}
            </div>
          </div>
          {this.showActions && !this.isPoster2 && <div class={this.actionsCls}>{renderTNodeJSX(this, 'actions')}</div>}
          {this.showStatus && <div class={this.actionsCls}>{renderTNodeJSX(this, 'status')}</div>}
        </div>
      );
    },
  },
  render() {
    if (this.loading) {
      return renderTNodeJSX(this, 'loading', {
        defaultNode: (
          <t-loading>
            <div class={this.baseCls}></div>
          </t-loading>
        ),
      });
    }
    return (
      <div class={this.baseCls}>
        {this.isHeaderRender ? this.renderHeader() : null}
        {this.showCover ? this.renderCover() : null}
        {this.showContent && <div class={this.bodyCls}>{renderContent(this, 'default', 'content')}</div>}
        {this.isFooterRender && (
          <div class={this.footerCls}>
            <div class={`${this.COMPONENT_NAME}__footer-wrapper`}>{renderTNodeJSX(this, 'footer')}</div>
            {this.showActions && this.isPoster2 && <div class={this.actionsCls}>{renderTNodeJSX(this, 'actions')}</div>}
          </div>
        )}
      </div>
    );
  },
});
