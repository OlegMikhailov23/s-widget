/**
 * S-Widget - v1.0.0 - 2020-08-28
 * https://github.com/OlegMikhailov23/s-widget
 *
 * Copyright (c) 2020 Oleg Mikhailov
 * Licensed Apache License 2.0 <https://github.com/OlegMikhailov23/s-widget/LICENSE>
 */

"use strict";
(function () {

  const render = (container, template, place = `beforeend`) => {
    container.insertAdjacentHTML(place, template);
  };

  const createWidget = () => {
    return (
      `<button class="main-button pulse" type="button" id="widgetButton" title="${widgetProperty.nameOfWidget}">${widgetProperty.nameOfWidget}</button>
<div class="widget-tools">
  <button class="tool-button tool-button-feedback" type="button" id="feedbackBtn" title="${widgetProperty.nameOfFeedbackBtn}">${widgetProperty.nameOfFeedbackBtn}</button>
  <a class="tool-button tool-button-whatsapp" id="whatsApp" title="${widgetProperty.nameOfWhatsappBtn}" href="${widgetProperty.refWhatsapp}">${widgetProperty.nameOfWhatsappBtn}</a>
  <a class="tool-button tool-button-vk" id="vk" title="${widgetProperty.nameOfVkBtn}" href="${widgetProperty.refVk}">${widgetProperty.nameOfVkBtn}</a>
  <a class="tool-button tool-button-inst" id="inst" title="${widgetProperty.nameOfInstBtn}" href="${widgetProperty.refInst}">${widgetProperty.nameOfInstBtn}</a>
  <a class="tool-button tool-button-recall" id="callMe" title="${widgetProperty.nameOfRecallBtn}" href="${widgetProperty.refPhoneNumber}">${widgetProperty.nameOfRecallBtn}</a>
</div>
<div class="modal-bg"></div>

<div class="modal-content" id="popup">
  <form class="modal__form" id="modalForm">
    <div class="flex-container">
      <h3 class="modal__form__title">${widgetProperty.modalFormTitle}</h3>
      <input class="modal__form__field modal__form__field-half" type="text" name="modal-name" id="modal-name" value=""
             placeholder="${widgetProperty.placeHolderName}" required>
      <input class="modal__form__field modal__form__field-half" type="tel" name="modal-phone" id="modal-phone"
             value="" placeholder="${widgetProperty.placeHolderPhone}" required>
    </div>
    <button class="modal__form__submit-btn" type="submit">Submit</button>
    <div class="load">
      <img src="img/giphy.gif" alt="Waiting...">
    </div>
    <span class="modal__form__usermessage" id="modal-form-usermessage"></span>
  </form>
  <button class="modal-content-close" type="button" title="Закрыть" id="formCloseBtn">Закрыть</button>
</div>`
    );
  };

  const widgetContainer = document.querySelector("#widgetContainer");

  render(widgetContainer, createWidget());

  const ESC_KEYCODE = 27;

  const widget = document.querySelector(`.main-button`);
  const widgetToolKit = document.querySelector(".widget-tools");
  const feedbackBtn = document.querySelector(`#feedbackBtn`);
  const modalForm = document.querySelector(`#popup`);
  const modalFormCloseBtn = document.querySelector(`#formCloseBtn`);
  const modalBg = document.querySelector(".modal-bg");


  widgetProperty.mainButtonColor ? widget.style.backgroundColor = widgetProperty.mainButtonColor : '';

  let getRandomIntegerNumber = function (min, max) {
    return min + Math.floor(Math.random() * (max - min));
  };

  const getRandomArrayItem = (array) => {
    const randomIndex = getRandomIntegerNumber(0, array.length);
    return array[randomIndex];
  };

  let intervalId;

  const changeButton = function () {
    intervalId = setInterval(() => {
      widget.style.backgroundImage = `url('img/${getRandomArrayItem(
        backGrounds
      )}')`;
    }, 2000);
  };

  changeButton();

  const onEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE) {
      closeForm();
      closeWidgetTool();
    }
  };

  const closeIffield = function (evt) {
    if (evt.target === modalBg) {
      closeForm();
      closeWidgetTool();
    }
  };

  const closeWidgetTool = function () {
    modalBg.classList.remove("modal-bg--show");
    widget.classList.remove("main-button--close");
    widgetToolKit.classList.remove("widget-tools--show");

    document.removeEventListener("keydown", onEscPress);
    modalBg.removeEventListener("mouseup", closeIffield);
  };

  const openForm = function () {
    modalForm.classList.add("modal-content-show");
  };

  const closeForm = function () {
    modalForm.classList.add("modal-content-hide");
    setTimeout(function () {
      modalForm.classList.remove("modal-content-show");
      modalForm.classList.remove("modal-content-hide");
    }, 250);
  };

  widget.addEventListener("click", () => {
    document.addEventListener("keydown", onEscPress);
    modalBg.addEventListener("mouseup", closeIffield);
    document
      .querySelector(".widget-tools")
      .classList.toggle("widget-tools--show");
    document.querySelector(".modal-bg").classList.toggle("modal-bg--show");
    widget.classList.toggle("main-button--close");
  });

  feedbackBtn.addEventListener("click", () => {
    openForm();
  });

  modalFormCloseBtn.addEventListener("click", () => {
    closeForm();
  });


  const loader = document.querySelector('.load');
  const userMessage = document.querySelector('#modal-form-usermessage');

  // Send AJAX

  $('#modalForm').submit(function (e) {
    e.preventDefault();
    var formdata = 'name=' + $('#modal-name').val() + '&phone=' + $('#modal-phone').val();
    //запишем все данные формы в переменную data
    $.ajax({
      url: `${widgetProperty.phpHandler}`,
      data: formdata,
      type: 'post',
      success: function (respond) {
        loader.style.display = 'block';
        setTimeout(function () {
          loader.style.display = 'none';
        }, 800);
        setTimeout(function () {
          userMessage.innerText = `${widgetProperty.successMessage}`;
        }, 800);
        setTimeout(function () {
          userMessage.innerText = ' ';
          modalForm.reset();
        }, 8000);
      },
      error: function () {
        loader.style.display = 'block';
        setTimeout(function () {
          loader.style.display = 'none';
        }, 800);
        setTimeout(function () {
          userMessage.innerText = `${widgetProperty.errorMessage}`;
        }, 800);
        setTimeout(function () {
          userMessage.innerText = ' ';
          modalForm.reset();
        }, 8000);
      }
    });
  });
})();

