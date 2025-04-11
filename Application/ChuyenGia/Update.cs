using Application.Core;
using Dapper;
using DATLICHKHAM.Domain;
using MediatR;
using Microsoft.Data.SqlClient;

namespace DATLICHKHAM.Application.ChuyenGia
{
    public class Update
    {
        public class Command: IRequest<Result<DLK_ChuyenGia>>
        {
            public DLK_ChuyenGiaUpdate Entity;
        }
        public class Handler : IRequestHandler<Command, Result<DLK_ChuyenGia>>
        {
            private readonly IConfiguration _configuration;

            public Handler(IConfiguration configuration)
            {
                _configuration = configuration;
            }
            public async Task<Result<DLK_ChuyenGia>> Handle(Command request, CancellationToken cancellationToken)
            {
                using (var connection = new SqlConnection(_configuration.GetConnectionString("DefaultConnection")))
                {
                    await connection.OpenAsync();
                    try
                    {
                        DynamicParameters parameters = new DynamicParameters();
                        parameters.Add("@MaNguoiDung", request.Entity.MaNguoiDung);
                        parameters.Add("@MaChuyenKhoa", request.Entity.MaChuyenKhoa);
                        parameters.Add("@HoTen", request.Entity.HoTen);
                        parameters.Add("@ChucDanh", request.Entity.ChucDanh);
                        parameters.Add("@ChucVu", request.Entity.ChucVu);
                        parameters.Add("@GioiTinh", request.Entity.GioiTinh);
                        parameters.Add("@NgaySinh", request.Entity.NgaySinh);
                        parameters.Add("@SoNamKinhNghiem", request.Entity.SoNamKinhNghiem);
                        parameters.Add("@GiaiThuong_NghienCuu", request.Entity.GiaiThuong_NghienCuu);
                        parameters.Add("@GioiThieu", request.Entity.GioiThieu);
                        parameters.Add("@DonViCongTac", request.Entity.DonViCongTac);
                        parameters.Add("@KinhNghiem", request.Entity.KinhNghiem);
                        parameters.Add("@DiaChi", request.Entity.DiaChi);
                        parameters.Add("@TrangThai", request.Entity.TrangThai);
                        parameters.Add("@AnhDaiDien", request.Entity.AnhDaiDien);
                        var result= await connection.QueryFirstOrDefaultAsync<DLK_ChuyenGia>("SP_Update_ChuyenGia", parameters, commandType: System.Data.CommandType.StoredProcedure);
                        return Result<DLK_ChuyenGia>.Success(result);

                    }
                    catch (Exception ex) 
                    { 
                        return Result<DLK_ChuyenGia>.Failure(ex.Message); 
                    }
                    finally
                    {
                        await connection.CloseAsync();
                    }
                }
            }
        }
    }
}
