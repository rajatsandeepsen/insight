const botNumber = process.env.SYSTEM_NUMBER ?? "0000000000"

export const OtpMailTemplate = (otp: number, number: string) =>
    `<div style="font-family: Helvetica,Arial,sans-serif;min-width:1000px;overflow:auto;line-height:2">
  <div style="margin:50px auto;width:70%;padding:20px 0">
    <div style="border-bottom:1px solid #eee">
      <a href="" style="font-size:1.4em;color: #00466a;text-decoration:none;font-weight:600">INSIGHT SJCET</a>
    </div>
    <p style="font-size:1.1em">Hi, ${number}</p>
    <p>Thank you for using our Insight Whatsapp Portal. Use the OTP: "${otp}" to complete your Sign Up procedures. OTP is valid for 24 hours</p>

    <a aria-label="Chat on WhatsApp" href="https://wa.me/91${botNumber}?text=${encodeURI(`Verify OTP ${otp}`)}">
    <h2 style="background: #51CE70;margin: 0 auto;width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">
    ${otp}
    </h2>
    <a />

    <p style="font-size:0.9em;">If you think this is a mistake, please contact tech support. <br/> Number: "${number}" is trying to authenticate</p>
    <hr style="border:none;border-top:1px solid #eee" />
    <div style="float:right;padding:8px 0;color:#aaa;font-size:0.8em;line-height:1;font-weight:300">
      <p>Insight</p>
      <p>SJCET Palai</p>
      <p>Kottayam</p>
    </div>
  </div>
</div>`