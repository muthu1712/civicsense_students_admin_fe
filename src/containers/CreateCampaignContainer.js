import React, { useEffect, useReducer, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as PropTypes from 'prop-types';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { CreateCampaign } from '../components/CreateCampaign';
import { formatDateToMMDDYYYYFormat, formatDateToDDMMYYYYFormat } from '../utils/helpers/GeneralUtils';
import createCampaignActions from '../actions/createCampaign';
import LoadingComponent from '../components/LoadingComponent';
import ToastComponent from '../components/ToastComponent';
import toastActions from '../actions/toastActions';

const loadingComponentStyle = {
  top: '40%',
  position: 'absolute',
  left: '42%',
  color: '#0084FF',
  width: '50px',
};

const CreateCampaignContainer = props => {
  const [campaign, setCampaign] = useReducer((state, newState) => ({ ...state, ...newState }), {
    campaignName: '',
    campaignStartDate: null,
    campaignEndDate: null,
    campaignSearchLocation: '',
    campaignSearchLocationId: '',
    description: '',
    rules: '',
    rewards: '',
    needForm: false,
  });

  const [fields, setFields] = useState([
    {
      label: '',
      type: '',
      data: '',
      isRequired: false,
    },
  ]);

  const [isDisabled, setIsDisabled] = useState(true);
  const [showSnackBar, setShowSnackBar] = useState(false);
  const dispatch = useDispatch();
  const locationListResponse = useSelector(state => state.fetchLocationListReducer);
  const createCampaignResponse = useSelector(state => state.createCampaignReducer);

  useEffect(() => disableCreateButton());

  const handleOnChange = (event, id, type) => {
    if (type === 'text') {
      setCampaign({
        [event.target.id]: event.target.value,
      });
    }
    if (type === 'date') {
      if (event !== null && event.valueOf() !== null) {
        setCampaign({
          [id]: formatDateToMMDDYYYYFormat(new Date(event.valueOf())),
        });
      } else {
        setCampaign({
          [id]: null,
        });
      }
    }
    if (type === 'dropdown') {
      if (event !== null) {
        setCampaign({
          [id]: event.label,
          campaignSearchLocationId: event.value,
        });
      } else {
        setCampaign({
          [id]: '',
          campaignSearchLocationId: '',
        });
      }
    }
    if (type === 'checkbox') {
      if (event !== null) {
        setCampaign({
          [id]: event.target.checked,
        });
      } else {
        setCampaign({
          [id]: false,
        });
      }
    }
  };

  const disableCreateButton = () => {
    setIsDisabled(
      !(
        campaign.campaignName !== '' &&
        campaign.campaignStartDate !== null &&
        campaign.campaignEndDate !== null &&
        campaign.campaignSearchLocation !== '' &&
        campaign.description !== '' &&
        campaign.rules !== '' &&
        campaign.rewards !== ''
      ),
    );
  };

  const handleChangeForDynamicFields = (i, event, type, id) => {
    let temp = [];
    temp = temp.concat(...fields);

    temp.forEach((a, index) => {
      if (index === i) {
        if (type === 'text') {
          temp.splice(i, 1, { ...a, [id]: event.target.value });
        }

        if (type === 'dropdownData') {
          let value = event.target.value;
          let array = value.split(',');
          array = array.map(string => string.trim());
          temp.splice(i, 1, { ...a, [id]: array });
        }

        if (type === 'dropdown') {
          if (event !== null) {
            temp.splice(i, 1, { ...a, [id]: event });
          } else {
            temp.splice(i, 1, { ...a, [id]: null });
          }
        }

        if (type === 'radio') {
          if (event !== null) {
            temp.splice(i, 1, { ...a, [id]: event.target.value === 'yes' });
          } else {
            temp.splice(i, 1, { ...a, [id]: false });
          }
        }
      }
    });

    setFields(temp);
  };

  const handleAdd = () => {
    const values = [...fields];
    values.push({
      label: '',
      type: '',
      data: '',
      isRequired: false,
    });
    setFields(values);
  };

  const handleRemove = i => {
    const values = [...fields];
    values.splice(i, 1);
    setFields(values);
  };

  const createCampaignEventHandler = () => {
    let locationIds = [];
    let dynamicFields = [];
    if (campaign.campaignSearchLocationId === 'all') {
      locationListResponse.locationList.forEach(location => {
        if (location.value !== 'all') locationIds.push(location.value);
      });
    } else {
      locationIds.push(campaign.campaignSearchLocationId);
    }

    if (!campaign.needForm) setFields([]);
    else {
      fields.map(field => {
        if (field.type === 'dropdown') {
          dynamicFields.push(field);
        } else {
          let tempFields = {};
          tempFields.label = field.label;
          tempFields.type = field.type;
          tempFields.isRequired = field.isRequired;
          dynamicFields.push(tempFields);
        }
      });
    }
    if (campaign.needForm) {
      dispatch({
        type: createCampaignActions.CREATE_CAMPAIGN,
        payload: {
          campaignName: campaign.campaignName,
          startDate: formatDateToDDMMYYYYFormat(campaign.campaignStartDate),
          endDate: formatDateToDDMMYYYYFormat(campaign.campaignEndDate),
          description: campaign.description,
          rules: campaign.rules,
          rewards: campaign.rewards,
          locationIds: locationIds,
          needForm: campaign.needForm,
          formFields: dynamicFields,
        },
      });
    } else {
      dispatch({
        type: createCampaignActions.CREATE_CAMPAIGN,
        payload: {
          campaignName: campaign.campaignName,
          startDate: formatDateToDDMMYYYYFormat(campaign.campaignStartDate),
          endDate: formatDateToDDMMYYYYFormat(campaign.campaignEndDate),
          description: campaign.description,
          rules: campaign.rules,
          rewards: campaign.rewards,
          locationIds: locationIds,
          needForm: campaign.needForm,
        },
      });
    }

    setShowSnackBar(true);
    props.handleCreateCampaignButtonClick();
    setCampaign({
      campaignName: '',
      campaignStartDate: null,
      campaignEndDate: null,
      campaignSearchLocation: '',
      campaignSearchLocationId: '',
      description: '',
      rules: '',
      rewards: '',
      needForm: false,
    });
    setFields([
      {
        label: '',
        type: '',
        data: '',
        isRequired: false,
      },
    ]);
  };

  const handleSnackBarExited = () => {
    setShowSnackBar(false);
    setCampaign({
      campaignName: '',
      campaignStartDate: null,
      campaignEndDate: null,
      campaignSearchLocation: '',
      campaignSearchLocationId: '',
      description: '',
      rules: '',
      rewards: '',
      needForm: false,
    });
    props.handleCreateCampaignButtonClick();
    setFields([
      {
        label: '',
        type: '',
        data: '',
        isRequired: false,
      },
    ]);
  };

  const handleToastClose = () => {
    dispatch({
      type: toastActions.CLOSE_NOTIFICATION_DIALOG_OR_TOAST_MESSAGE,
    });
  };

  if (locationListResponse.isLoading) {
    return <LoadingComponent isLoading={locationListResponse.isLoading} style={loadingComponentStyle} />;
  } else if (
    createCampaignResponse.createCampaignError !== '' &&
    createCampaignResponse.createCampaignError !== undefined
  ) {
    return (
      <ToastComponent
        toastMessage={'Error while saving campaign details. Please try later...'}
        openToast={createCampaignResponse.createCampaignError !== ''}
        handleClose={handleToastClose}
        toastVariant={'error'}
      />
    );
  } else if (
    createCampaignResponse.createCampaignMessage !== '' &&
    createCampaignResponse.createCampaignMessage !== undefined
  ) {
    return (
      <ToastComponent
        toastMessage={'Campaign created successfully'}
        openToast={createCampaignResponse.createCampaignMessage !== ''}
        handleClose={handleToastClose}
        toastVariant={'success'}
      />
    );
  } else {
    return (
      <MuiPickersUtilsProvider utils={MomentUtils}>
        <CreateCampaign
          createCampaign={props.createCampaign}
          handleCreateCampaignButtonClick={props.handleCreateCampaignButtonClick}
          campaignDetails={campaign}
          handleOnChange={handleOnChange}
          locationList={locationListResponse.locationList}
          handleAdd={handleAdd}
          handleRemove={handleRemove}
          handleChangeForDynamicFields={handleChangeForDynamicFields}
          fields={fields}
          isDisabled={isDisabled}
          showSnackBar={showSnackBar}
          handleSnackBarExited={handleSnackBarExited}
          createCampaignEventHandler={createCampaignEventHandler}
        />
      </MuiPickersUtilsProvider>
    );
  }
};

CreateCampaignContainer.propTypes = {
  createCampaign: PropTypes.bool.isRequired,
  handleCreateCampaignButtonClick: PropTypes.func.isRequired,
};

export default CreateCampaignContainer;
