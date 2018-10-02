import _ from 'underscore';
import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import autoBind from 'react-autobind';
import reactMixin from 'react-mixin';
import Reflux from 'reflux';
import TextBox from '../textBox';
import mixins from '../../mixins';
import bem from '../../bem';
import {
  ORDER_OPTIONS,
  GROUPBY_OPTIONS,
  galleryActions,
  galleryStore
} from './galleryInterface';
import {
  t,
  assign
} from '../../utils';

const groupByOptions = [
  GROUPBY_OPTIONS.question,
  GROUPBY_OPTIONS.submission
];
const orderOptions = [
  ORDER_OPTIONS.asc,
  ORDER_OPTIONS.desc
];

export default class FormGalleryFilter extends React.Component {
  constructor(props){
    super(props);
    this.state = assign({}, galleryStore.state);
    autoBind(this);
  }

  componentDidMount() {
    this.listenTo(galleryStore, (storeChanges) => {
      this.setState(storeChanges);
    });
  }

  onFilterQueryChange(newVal) {
    galleryActions.setFilters({filterQuery: newVal});
  }

  onFilterGroupChange(newVal) {
    galleryActions.setFilters({filterGroupBy: newVal});
  }

  onFilterOrderChange(newVal) {
    galleryActions.setFilters({filterOrder: newVal});
  }

  onFilterAllVersionsChange(evt) {
    galleryActions.setFilters({filterAllVersions: evt.currentTarget.checked});
  }

  toggleFullscreen () {
    galleryActions.toggleFullscreen();
  }

  render() {
    const currentAsset = this.currentAsset();
    const deployedVersionsCount = currentAsset.deployed_versions.count;

    return (
      <bem.AssetGallery__heading>
        {this.state.totalMediaCount !== null &&
          <bem.AssetGallery__headingCount>
            {t('Images: ##visible##/##total##').replace('##visible##', this.state.filteredMediaCount).replace('##total##', this.state.totalMediaCount)}
          </bem.AssetGallery__headingCount>
        }

        <TextBox
          type='search'
          placeholder={t('Filter results')}
          onChange={this.onFilterQueryChange}
          value={this.state.filterQuery}
        />

        <Select
          options={groupByOptions}
          className='kobo-select'
          classNamePrefix='kobo-select'
          value={this.state.filterGroupBy ? this.state.filterGroupBy : false}
          onChange={this.onFilterGroupChange}
          isClearable={false}
          isSearchable={false}
        />

        <Select
          options={orderOptions}
          className='kobo-select'
          classNamePrefix='kobo-select'
          value={this.state.filterOrder ? this.state.filterOrder : false}
          onChange={this.onFilterOrderChange}
          isClearable={false}
          isSearchable={false}
        />

        <bem.AssetGallery__headingIconButton
          className='right-tooltip'
          onClick={this.toggleFullscreen}
          data-tip={t('Toggle fullscreen')}
        >
          <i className='k-icon-expand' />
        </bem.AssetGallery__headingIconButton>


        <bem.AssetGallery__headingCheckbox
          htmlFor='all-versions'
          disabled={deployedVersionsCount < 2}
        >
          <input
            type='checkbox'
            checked={this.state.filterAllVersions}
            onChange={this.onFilterAllVersionsChange}
            id='all-versions'
          />

          <span>{t('Include submissions from all ##count## deployed versions').replace('##count##', deployedVersionsCount)}</span>
        </bem.AssetGallery__headingCheckbox>
      </bem.AssetGallery__heading>
    );
  }
};

reactMixin(FormGalleryFilter.prototype, Reflux.ListenerMixin);
reactMixin(FormGalleryFilter.prototype, mixins.contextRouter);

FormGalleryFilter.contextTypes = {
  router: PropTypes.object
};
