import video from "./../../../public/Site Maintenance.mp4"
function ComingSoon() {
  return (
    <>
      <div className="flex flex-col gap-5 items-center justify-center">
        <video autoPlay muted loop className="w-[20rem] h-auto pointer-events-none rounded-3xl">
          <source src={video} type="video/mp4" />
        </video>
        <p className="text-Gray text-2xl">...به زودی</p>
      </div>
    </>
  )
}
export default ComingSoon